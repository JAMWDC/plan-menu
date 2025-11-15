import React, { useState, useMemo } from 'react';

// Opciones de menú con cantidades razonables por comensal (ajustables)
const MENU_OPCIONES = {
  entrantes: [
    { nombre: "Judías verdes", qty: "150g" },
    { nombre: "Puré de zanahoria", qty: "250ml" },
    { nombre: "Puré de calabacín", qty: "250ml" },
    { nombre: "Caldo o sopa de fideos", qty: "250ml" },
    { nombre: "Guisantes", qty: "150g" },
    { nombre: "Coliflor", qty: "150g" },
    { nombre: "Pisto", qty: "180g" },
    { nombre: "Garbanzos con tomate", qty: "200g" },
    { nombre: "Alcachofas", qty: "2 unidades" },
    { nombre: "Macarrones con queso y chorizo", qty: "180g" },
    { nombre: "Arroz blanco", qty: "150g" },
    { nombre: "Arroz con tomate", qty: "180g" },
  ],
  platosPrincipales: [
    { nombre: "Filetes de ternera a la plancha", qty: "1 unidad" },
    { nombre: "Carne guisada", qty: "200g" },
    { nombre: "Bacalao rebozado", qty: "180g" },
    { nombre: "Merluza rebozada", qty: "180g" },
    { nombre: "Gallo rebozado", qty: "180g" },
    { nombre: "Chuletas de cordero", qty: "2 unidades" },
    { nombre: "Filete de pollo a la plancha", qty: "1 unidad" },
    { nombre: "Pollo al horno", qty: "200g" },
    { nombre: "Tortilla de patata", qty: "1 porción" },
    { nombre: "Huevos fritos", qty: "2 unidades" },
    { nombre: "Tortilla francesa", qty: "2 huevos" },
    { nombre: "Filete de ternera empanado", qty: "1 unidad" },
    { nombre: "Filetes de cerdo adobado", qty: "3 unidades" },
  ],
  acompanamientos: [
    { nombre: "Patatas fritas", qty: "120g" },
    { nombre: "Patatas al horno", qty: "150g" },
    { nombre: "Ensalada de lechuga", qty: "80g" },
    { nombre: "Ensalada de tomate", qty: "100g" },
    { nombre: "Arroz blanco", qty: "70g" },
    { nombre: "Pan", qty: "2 unidades" },
  ]
};

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const CATEGORIAS = ['entrantes', 'platosPrincipales', 'acompanamientos'];

const initialMenuState = DIAS.reduce((acc, dia) => {
  acc[dia] = CATEGORIAS.reduce((dayAcc, cat) => {
    dayAcc[cat] = '';
    return dayAcc;
  }, {});
  return acc;
}, {});

function App() {
  const [menu, setMenu] = useState(initialMenuState);
  const [comensales, setComensales] = useState(4);

  const handleMenuChange = (dia, categoria, plato) => {
    setMenu(prevMenu => ({
      ...prevMenu,
      [dia]: {
        ...prevMenu[dia],
        [categoria]: plato,
      },
    }));
  };

  const cantidadesTotales = useMemo(() => {
    const totales = {};

    Object.values(menu).forEach(diaMenu => {
      CATEGORIAS.forEach(categoria => {
        const platoNombre = diaMenu[categoria];
        if (!platoNombre) return;

        const plato = MENU_OPCIONES[categoria].find(p => p.nombre === platoNombre);
        if (!plato || !plato.qty) return;

        const match = plato.qty.match(/(\d+\.?\d*)\s*([a-zA-ZáéíóúÁÉÍÓÚñÑ]+)/);
        if (!match) return;

        const cantidadBase = parseFloat(match[1]);
        const unidad = match[2];
        const claveUnica = `${plato.nombre} (${unidad})`;
        const cantidadTotal = cantidadBase * comensales;

        totales[claveUnica] = (totales[claveUnica] || 0) + cantidadTotal;
      });
    });

    return Object.entries(totales).map(([clave, total]) => {
      const match = clave.match(/^(.*) \((.*)\)$/);
      const ingrediente = match ? match[1] : clave;
      const unidad = match ? match[2] : '';

      return {
        ingrediente,
        unidad,
        total: total.toFixed(1).replace(/\.0$/, ''),
      };
    }).sort((a, b) => a.ingrediente.localeCompare(b.ingrediente));
  }, [menu, comensales]);

  const containerClasses = "p-4 sm:p-8 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen";
  const cardClasses = "bg-white shadow-xl rounded-2xl p-6 sm:p-8 mb-8 border-t-8 border-green-500";
  const headerClasses = "text-4xl font-extrabold text-gray-900 mb-6";
  const subHeaderClasses = "text-xl font-semibold text-green-700 mt-6 mb-3";
  const selectClasses = "mt-1 block w-full pl-4 pr-10 py-2 border-gray-300 focus:ring-green-500 focus:border-green-500 rounded-lg shadow-sm";

  return (
    <div className={containerClasses}>

      {/* TÍTULO SIN CORAZÓN */}
      <h1 className="text-6xl font-black text-center text-gray-800 mb-12 tracking-tighter">
        Planificador Familiar de Menús
      </h1>

      {/* Comensales */}
      <div className={cardClasses + " flex flex-col sm:flex-row justify-between items-center bg-green-50 border-green-400"}>
        <label className="text-xl font-bold">Número de Comensales:</label>
        <input
          type="number"
          min="1"
          value={comensales}
          onChange={(e) => setComensales(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-24 text-center border-2 border-gray-300 rounded-lg py-2"
        />
      </div>

      {/* Menú semanal */}
      <div className={cardClasses}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={headerClasses}>Elige tu Menú Semanal</h2>
          <button
            onClick={() => setMenu(initialMenuState)}
            className="px-4 py-1 bg-red-500 text-white font-medium rounded-full text-sm"
          >
            Reiniciar Todo
          </button>
        </div>

        {DIAS.map(dia => (
          <div key={dia} className="border-b p-4 mb-4">
            <h3 className={subHeaderClasses}>{dia}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-3">
              {CATEGORIAS.map(cat => (
                <div key={cat}>
                  <label className="capitalize text-sm font-semibold text-gray-700 mb-1">
                    {cat === 'platosPrincipales' ? 'Plato Principal' : cat.replace(/s$/, '')}:
                  </label>
                  <select
                    className={selectClasses}
                    value={menu[dia][cat]}
                    onChange={(e) => handleMenuChange(dia, cat, e.target.value)}
                  >
                    <option value="">-- seleccionar --</option>
                    {MENU_OPCIONES[cat].map(plato => (
                      <option key={plato.nombre} value={plato.nombre}>
                        {plato.nombre} ({plato.qty})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lista de compra */}
      <div className={cardClasses}>
        <h2 className={headerClasses}>Lista de la Compra ({comensales} Comensales)</h2>

        {cantidadesTotales.length === 0 ? (
          <p className="text-lg text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-dashed">
            Selecciona platos para generar automáticamente la lista.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase">
                    Ingrediente/Plato
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-green-700 uppercase">
                    Cantidad Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {cantidadesTotales.map((item, index) => (
                  <tr key={index} className="hover:bg-green-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.ingrediente}
                    </td>
                    <td className="px-6 py-4 text-right text-lg font-bold text-green-600">
                      {item.total} {item.unidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

