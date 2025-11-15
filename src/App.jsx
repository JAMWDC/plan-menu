import { useState } from "react";

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

// Base de datos simple con cantidades estándar por persona
const entrantes = [
  { nombre: "Judías verdes", qty: "150g" },
  { nombre: "Ensalada mixta", qty: "120g" },
  { nombre: "Crema de calabacín", qty: "200ml" }
];

const platosPrincipales = [
  { nombre: "Filete de ternera", qty: "1 unidad" },
  { nombre: "Pollo al horno", qty: "200g" },
  { nombre: "Salmón a la plancha", qty: "180g" }
];

const acompanamientos = [
  { nombre: "Arroz blanco", qty: "70g" },
  { nombre: "Patatas al horno", qty: "150g" },
  { nombre: "Verduras salteadas", qty: "120g" }
];

export default function App() {
  const [comensales, setComensales] = useState(2);

  const [menu, setMenu] = useState(
    dias.map(() => ({
      entrante: "",
      principal: "",
      acompanamiento: ""
    }))
  );

  const actualizarMenu = (i, campo, valor) => {
    const nuevo = [...menu];
    nuevo[i][campo] = valor;
    setMenu(nuevo);
  };

  const generarListaCompra = () => {
    const items = {};

    const agregar = (nombre, qty) => {
      if (!items[nombre]) items[nombre] = [];
      items[nombre].push(qty);
    };

    menu.forEach((dia) => {
      [dia.entrante, dia.principal, dia.acompanamiento].forEach((plato) => {
        if (!plato) return;

        const base =
          entrantes.find((e) => e.nombre === plato) ||
          platosPrincipales.find((p) => p.nombre === plato) ||
          acompanamientos.find((a) => a.nombre === plato);

        if (base) {
          agregar(
            base.nombre,
            `${base.qty} × ${comensales} → (${calcularTotal(base.qty, comensales)})`
          );
        }
      });
    });

    return items;
  };

  const calcularTotal = (qty, personas) => {
    const numero = parseInt(qty);

    if (isNaN(numero)) return qty; // Para "1 unidad", "1 pieza", etc.

    const total = numero * personas;

    if (qty.includes("g")) return `${total}g`;
    if (qty.includes("ml")) return `${total}ml`;

    return `${total} unidades`;
  };

  const lista = generarListaCompra();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Planificador de Menús Semanal</h1>

      {/* Selector de número de comensales */}
      <div style={{ marginBottom: "20px" }}>
        <label>
          <strong>Número de comensales: </strong>
          <input
            type="number"
            min="1"
            value={comensales}
            onChange={(e) => setComensales(parseInt(e.target.value))}
            style={{ width: "60px", marginLeft: "10px" }}
          />
        </label>
      </div>

      {/* Configurador del menú */}
      {dias.map((dia, i) => (
        <div
          key={dia}
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderBottom: "1px solid #ccc"
          }}
        >
          <h3>{dia}</h3>

          <label>Entrante: </label>
          <select
            value={menu[i].entrante}
            onChange={(e) => actualizarMenu(i, "entrante", e.target.value)}
          >
            <option value="">-- seleccionar --</option>
            {entrantes.map((e) => (
              <option key={e.nombre} value={e.nombre}>
                {e.nombre}
              </option>
            ))}
          </select>

          <br />

          <label>Plato principal: </label>
          <select
            value={menu[i].principal}
            onChange={(e) => actualizarMenu(i, "principal", e.target.value)}
          >
            <option value="">-- seleccionar --</option>
            {platosPrincipales.map((p) => (
              <option key={p.nombre} value={p.nombre}>
                {p.nombre}
              </option>
            ))}
          </select>

          <br />

          <label>Acompañamiento: </label>
          <select
            value={menu[i].acompanamiento}
            onChange={(e) => actualizarMenu(i, "acompanamiento", e.target.value)}
          >
            <option value="">-- seleccionar --</option>
            {acompanamientos.map((a) => (
              <option key={a.nombre} value={a.nombre}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
      ))}

      {/* Lista de compra generada */}
      <h2>Lista de la compra</h2>
      {Object.keys(lista).length === 0 ? (
        <p>Aún no has seleccionado platos.</p>
      ) : (
        <ul>
          {Object.entries(lista).map(([nombre, cantidades]) => (
            <li key={nombre}>
              <strong>{nombre}</strong>:<br />
              {cantidades.map((c, idx) => (
                <div key={idx}>• {c}</div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
