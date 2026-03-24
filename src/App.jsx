import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Configuración: Mínimo de votos antes de que se aplique la regla del 50%
  const MINIMO_VOTOS_PARA_CIERRE = 3

  // Estados principales
  const [vehiculos, setVehiculos] = useState([])
  const [votantes, setVotantes] = useState([])
  const [votacionCerrada, setVotacionCerrada] = useState(false)

  // Estados del formulario
  const [dui, setDui] = useState('')
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('')
  const [modeloSeleccionado, setModeloSeleccionado] = useState('')
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' })

  // Catálogo de vehículos con imágenes
  const vehiculosDisponibles = [
    {
      id: 1,
      marca: 'Toyota',
      modelo: 'Corolla 2024',
      imagen: 'https://www.toyota.com.sv/wp-content/uploads/2024/09/SILVER-METALLIC-1F7.png'
    },
    {
      id: 2,
      marca: 'Honda',
      modelo: 'Civic 2024',
      imagen: 'https://d31sro4iz4ob5n.cloudfront.net/upload/car/civic-type-r-2023/color/lhd-boost-blue-pearl/1.png?v=253413267'
    },
    {
      id: 3,
      marca: 'BMW',
      modelo: 'Serie 3 2024',
      imagen: 'https://www.km77.com/images/medium/2/5/5/7/bmw-serie-3-2024.372557.jpg'
    },
    {
      id: 4,
      marca: 'Mercedes-Benz',
      modelo: 'Clase C 2024',
      imagen: 'https://di-uploads-pod14.dealerinspire.com/downtownlamotorsmercedesbenz/uploads/2024/01/2024-Mercedes-Benz-C-Class.png'
    },
    {
      id: 5,
      marca: 'Ford',
      modelo: 'Mustang 2024',
      imagen: 'https://www.bkford.com/blogs/2764/wp-content/uploads/2024/05/24_FRD_MST_S5A0331_1e_V2.jpg'
    }
  ]

  // Crear estructura para los selectores (marca -> modelos)
  const catalogoVehiculos = vehiculosDisponibles.reduce((acc, vehiculo) => {
    if (!acc[vehiculo.marca]) {
      acc[vehiculo.marca] = []
    }
    acc[vehiculo.marca].push(vehiculo.modelo)
    return acc
  }, {})

  // Función para obtener la imagen de un vehículo
  const obtenerImagenVehiculo = (marca, modelo) => {
    const vehiculo = vehiculosDisponibles.find(
      v => v.marca === marca && v.modelo === modelo
    )
    return vehiculo ? vehiculo.imagen : null
  }

  // Generar número aleatorio entre 10 y 20 al iniciar
  const [numeroAleatorio] = useState(Math.floor(Math.random() * 11) + 10)

  // Validar formato de DUI (########-#)
  const validarDUI = (dui) => {
    const duiRegex = /^\d{8}-\d{1}$/
    return duiRegex.test(dui)
  }

  // Formatear DUI automáticamente mientras se escribe
  const formatearDUI = (valor) => {
    // Remover todo excepto números
    const soloNumeros = valor.replace(/\D/g, '')

    // Si tiene más de 8 dígitos, agregar el guión automáticamente
    if (soloNumeros.length <= 8) {
      return soloNumeros
    } else {
      // Formato: 8 dígitos + guión + 1 dígito
      return soloNumeros.slice(0, 8) + '-' + soloNumeros.slice(8, 9)
    }
  }

  // Manejar cambio en el campo DUI
  const handleDuiChange = (e) => {
    const valorFormateado = formatearDUI(e.target.value)
    setDui(valorFormateado)
  }

  // Registrar voto
  const registrarVoto = (e) => {
    e.preventDefault()

    // Validaciones
    if (!dui || !marcaSeleccionada || !modeloSeleccionado) {
      setMensaje({ tipo: 'danger', texto: 'Todos los campos son obligatorios' })
      return
    }

    if (!validarDUI(dui)) {
      setMensaje({ tipo: 'danger', texto: 'Formato de DUI inválido. Debe ser ########-#' })
      return
    }

    // Verificar DUI único
    if (votantes.includes(dui)) {
      setMensaje({ tipo: 'warning', texto: 'Este DUI ya ha votado. Solo se permite un voto por persona' })
      return
    }

    // Registrar voto
    const vehiculoKey = `${marcaSeleccionada} ${modeloSeleccionado}`
    const imagenVehiculo = obtenerImagenVehiculo(marcaSeleccionada, modeloSeleccionado)
    const vehiculoExistente = vehiculos.find(v => v.vehiculo === vehiculoKey)

    if (vehiculoExistente) {
      setVehiculos(vehiculos.map(v =>
        v.vehiculo === vehiculoKey
          ? { ...v, votos: v.votos + 1 }
          : v
      ))
    } else {
      setVehiculos([...vehiculos, {
        vehiculo: vehiculoKey,
        marca: marcaSeleccionada,
        modelo: modeloSeleccionado,
        imagen: imagenVehiculo,
        votos: 1
      }])
    }

    setVotantes([...votantes, dui])
    setMensaje({ tipo: 'success', texto: '¡Voto registrado exitosamente!' })

    // Limpiar formulario
    setDui('')
    setMarcaSeleccionada('')
    setModeloSeleccionado('')
  }

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const totalVotos = vehiculos.reduce((sum, v) => sum + v.votos, 0)

    const vehiculosConPorcentaje = vehiculos.map((v, index) => ({
      ...v,
      numero: index + 1,
      porcentaje: totalVotos > 0 ? (v.votos / totalVotos) * 100 : 0,
      clasificacion: ''
    }))

    // Ordenar de mayor a menor por votos
    vehiculosConPorcentaje.sort((a, b) => b.votos - a.votos)

    // Asignar clasificación
    vehiculosConPorcentaje.forEach(v => {
      if (v.porcentaje > 50) {
        v.clasificacion = 'Dominio Absoluto'
      } else if (v.porcentaje >= 35 && v.porcentaje <= 50) {
        v.clasificacion = 'Alta Preferencia'
      } else if (v.porcentaje >= 20 && v.porcentaje < 35) {
        v.clasificacion = 'Preferencia Media'
      } else {
        v.clasificacion = 'Baja Preferencia'
      }
    })

    // Renumerar después de ordenar
    vehiculosConPorcentaje.forEach((v, index) => {
      v.numero = index + 1
    })

    return vehiculosConPorcentaje
  }

  const estadisticas = calcularEstadisticas()
  const totalVotos = vehiculos.reduce((sum, v) => sum + v.votos, 0)

  // Obtener ganador y último lugar
  const ganador = estadisticas.length > 0 ? estadisticas[0] : null
  const ultimoLugar = estadisticas.length > 0 ? estadisticas[estadisticas.length - 1] : null

  // Calcular diferencia entre 1° y 2° lugar
  const diferenciaPrimeroSegundo = estadisticas.length > 1
    ? (estadisticas[0].porcentaje - estadisticas[1].porcentaje).toFixed(2)
    : '0.00'

  // Top 5
  const top5 = estadisticas.slice(0, 5)

  // Verificar si se debe cerrar la votación
  useEffect(() => {
    if (ganador && ganador.porcentaje > 50 && totalVotos >= MINIMO_VOTOS_PARA_CIERRE) {
      setVotacionCerrada(true)
    }
  }, [ganador, totalVotos])

  // Reiniciar votación
  const reiniciarVotacion = () => {
    setVehiculos([])
    setVotantes([])
    setVotacionCerrada(false)
    setDui('')
    setMarcaSeleccionada('')
    setModeloSeleccionado('')
    setMensaje({ tipo: '', texto: '' })
  }

  return (
    <div className="container-fluid py-4">
      <h1 className="text-center mb-4">🚗 Sistema de Votación - Vehículo Más Llamativo</h1>

      {/* Número Aleatorio */}
      <div className="alert alert-info text-center">
        <strong>Número Aleatorio Generado:</strong> {numeroAleatorio} |
        <strong className="ms-3">Mínimo de Votos para Cierre Automático:</strong> {MINIMO_VOTOS_PARA_CIERRE}
      </div>

      {/* Formulario de Registro */}
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Registrar Voto</h4>
            </div>
            <div className="card-body">
              {mensaje.texto && (
                <div className={`alert alert-${mensaje.tipo} alert-dismissible fade show`} role="alert">
                  {mensaje.texto}
                  <button type="button" className="btn-close" onClick={() => setMensaje({ tipo: '', texto: '' })}></button>
                </div>
              )}

              {votacionCerrada && (
                <div className="alert alert-warning">
                  <strong>¡Votación Cerrada!</strong> Un vehículo ha superado el 50% de los votos.
                </div>
              )}

              <form onSubmit={registrarVoto}>
                <div className="mb-3">
                  <label className="form-label">DUI (########-#)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dui}
                    onChange={handleDuiChange}
                    placeholder="12345678-9"
                    disabled={votacionCerrada}
                    maxLength="10"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Marca</label>
                  <select
                    className="form-select"
                    value={marcaSeleccionada}
                    onChange={(e) => {
                      setMarcaSeleccionada(e.target.value)
                      setModeloSeleccionado('')
                    }}
                    disabled={votacionCerrada}
                  >
                    <option value="">Seleccione una marca</option>
                    {Object.keys(catalogoVehiculos).map(marca => (
                      <option key={marca} value={marca}>{marca}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Modelo</label>
                  <select
                    className="form-select"
                    value={modeloSeleccionado}
                    onChange={(e) => setModeloSeleccionado(e.target.value)}
                    disabled={!marcaSeleccionada || votacionCerrada}
                  >
                    <option value="">Seleccione un modelo</option>
                    {marcaSeleccionada && catalogoVehiculos[marcaSeleccionada].map(modelo => (
                      <option key={modelo} value={modelo}>{modelo}</option>
                    ))}
                  </select>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={votacionCerrada}
                  >
                    Registrar Voto
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={reiniciarVotacion}
                  >
                    🔄 Reiniciar Votación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      {estadisticas.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card shadow">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">📊 Estadísticas Generales</h4>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="border p-3 rounded">
                      <h5>Total de Votos</h5>
                      <h2 className="text-primary">{totalVotos}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border p-3 rounded bg-success text-white">
                      <h5>🏆 Mayor %</h5>
                      <h6>{ganador.marca} {ganador.modelo}</h6>
                      <h3>{ganador.porcentaje.toFixed(2)}%</h3>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border p-3 rounded bg-danger text-white">
                      <h5>📉 Menor %</h5>
                      <h6>{ultimoLugar.marca} {ultimoLugar.modelo}</h6>
                      <h3>{ultimoLugar.porcentaje.toFixed(2)}%</h3>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border p-3 rounded bg-warning text-white">
                      <h5>Diferencia 1°-2°</h5>
                      <h3>{diferenciaPrimeroSegundo}%</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Resultados */}
      {estadisticas.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card shadow">
              <div className="card-header bg-dark text-white">
                <h4 className="mb-0">📋 Tabla de Resultados (Ordenado de Mayor a Menor)</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>N°</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Votos</th>
                        <th>Porcentaje</th>
                        <th>Clasificación</th>
                        <th>Imagen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estadisticas.map((v) => (
                        <tr key={v.vehiculo} className={v.numero === 1 ? 'table-success' : ''}>
                          <td><strong>{v.numero}</strong></td>
                          <td>{v.marca}</td>
                          <td>{v.modelo}</td>
                          <td><span className="badge bg-primary">{v.votos}</span></td>
                          <td><strong>{v.porcentaje.toFixed(2)}%</strong></td>
                          <td>
                            <span className={`badge ${
                              v.clasificacion === 'Dominio Absoluto' ? 'bg-success' :
                              v.clasificacion === 'Alta Preferencia' ? 'bg-info' :
                              v.clasificacion === 'Preferencia Media' ? 'bg-warning' :
                              'bg-secondary'
                            }`}>
                              {v.clasificacion}
                            </span>
                          </td>
                          <td>
                            <div className="text-center">
                              {v.imagen ? (
                                <img
                                  src={v.imagen}
                                  alt={`${v.marca} ${v.modelo}`}
                                  style={{
                                    width: '150px',
                                    height: '100px',
                                    objectFit: 'contain',
                                    borderRadius: '5px'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'block'
                                  }}
                                />
                              ) : null}
                              <div className="bg-light p-2 rounded" style={{ width: '150px', height: '100px', display: v.imagen ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <small className="text-muted">Imagen no disponible</small>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ranking Top 5 */}
      {top5.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card shadow">
              <div className="card-header bg-warning text-white">
                <h4 className="mb-0">🏅 Ranking Top 5</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-warning">
                      <tr>
                        <th>Posición</th>
                        <th>Vehículo</th>
                        <th>Votos</th>
                        <th>Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top5.map((v, index) => (
                        <tr key={v.vehiculo}>
                          <td>
                            <strong>
                              {index === 0 && '🥇'}
                              {index === 1 && '🥈'}
                              {index === 2 && '🥉'}
                              {index > 2 && `#${index + 1}`}
                            </strong>
                          </td>
                          <td>{v.marca} {v.modelo}</td>
                          <td>{v.votos}</td>
                          <td><strong>{v.porcentaje.toFixed(2)}%</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla Resumen */}
      {estadisticas.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-8 mx-auto">
            <div className="card shadow">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">📝 Resumen de Votación</h4>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td><strong>Total de Votos Registrados:</strong></td>
                      <td>{totalVotos}</td>
                    </tr>
                    <tr>
                      <td><strong>Total de Votantes (DUI únicos):</strong></td>
                      <td>{votantes.length}</td>
                    </tr>
                    <tr>
                      <td><strong>Vehículos en Competencia:</strong></td>
                      <td>{estadisticas.length}</td>
                    </tr>
                    <tr className="table-success">
                      <td><strong>🏆 Vehículo Ganador:</strong></td>
                      <td>{ganador.marca} {ganador.modelo} ({ganador.porcentaje.toFixed(2)}%)</td>
                    </tr>
                    <tr className="table-danger">
                      <td><strong>📉 Último Lugar:</strong></td>
                      <td>{ultimoLugar.marca} {ultimoLugar.modelo} ({ultimoLugar.porcentaje.toFixed(2)}%)</td>
                    </tr>
                    <tr>
                      <td><strong>Diferencia 1° - 2° Lugar:</strong></td>
                      <td>{diferenciaPrimeroSegundo} puntos porcentuales</td>
                    </tr>
                    <tr>
                      <td><strong>Estado de Votación:</strong></td>
                      <td>
                        <span className={`badge ${votacionCerrada ? 'bg-danger' : 'bg-success'}`}>
                          {votacionCerrada ? 'CERRADA (Superó 50%)' : 'ABIERTA'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Número Aleatorio del Sistema:</strong></td>
                      <td>{numeroAleatorio}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay votos */}
      {estadisticas.length === 0 && (
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="alert alert-info text-center">
              <h4>No hay votos registrados aún</h4>
              <p>Comienza a registrar votos para ver las estadísticas y resultados.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
