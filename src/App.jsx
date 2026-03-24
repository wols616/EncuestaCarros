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
      <div className="alert alert-purple text-center">
        <strong>Número Aleatorio Generado:</strong> {numeroAleatorio} |
        <strong className="ms-3">Mínimo de Votos para Cierre Automático:</strong> {MINIMO_VOTOS_PARA_CIERRE}
      </div>

      {/* Formulario de Registro */}
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card shadow mb-4">
            <div className="card-header bg-purple-primary text-white">
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
                <div className="alert alert-purple">
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

                <div className="mb-4">
                  <label className="form-label">Seleccione su vehículo favorito:</label>
                  <div className="row g-3">
                    {vehiculosDisponibles.map((vehiculo) => {
                      const isSelected = marcaSeleccionada === vehiculo.marca && modeloSeleccionado === vehiculo.modelo;
                      return (
                        <div key={vehiculo.id} className="col-md-6 col-lg-4">
                          <label className={`card vehicle-card h-100 cursor-pointer ${isSelected ? 'border-purple-selected' : ''}`} style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}>
                            <input
                              type="radio"
                              name="vehiculo"
                              value={`${vehiculo.marca}-${vehiculo.modelo}`}
                              checked={isSelected}
                              onChange={() => {
                                setMarcaSeleccionada(vehiculo.marca);
                                setModeloSeleccionado(vehiculo.modelo);
                              }}
                              disabled={votacionCerrada}
                              style={{ display: 'none' }}
                            />
                            <div className="card-body text-center p-3 vehicle-selection-card">
                              <div className="vehicle-image-container mb-3" style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {vehiculo.imagen ? (
                                  <img
                                    src={vehiculo.imagen}
                                    alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                                    className="img-fluid"
                                    style={{
                                      maxHeight: '120px',
                                      maxWidth: '100%',
                                      objectFit: 'contain',
                                      borderRadius: '8px'
                                    }}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const parent = e.target.parentNode;
                                      const fallbackDiv = document.createElement('div');
                                      fallbackDiv.className = 'bg-light d-flex align-items-center justify-content-center';
                                      fallbackDiv.style.cssText = 'height: 120px; width: 100%; border-radius: 8px; border: 2px dashed var(--purple-light);';
                                      fallbackDiv.innerHTML = '<small class="text-muted">Imagen no disponible</small>';
                                      parent.appendChild(fallbackDiv);
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="bg-light d-flex align-items-center justify-content-center"
                                    style={{
                                      height: '120px',
                                      width: '100%',
                                      borderRadius: '8px',
                                      border: '2px dashed var(--purple-light)'
                                    }}
                                  >
                                    <small className="text-muted">Imagen no disponible</small>
                                  </div>
                                )}
                              </div>
                              <h6 className="card-title mb-1" style={{ color: 'var(--purple-primary)', fontWeight: 'bold' }}>
                                {vehiculo.marca}
                              </h6>
                              <p className="card-text mb-0" style={{ color: '#666', fontSize: '0.9rem' }}>
                                {vehiculo.modelo}
                              </p>
                              {isSelected && (
                                <div className="mt-2">
                                  <span className="badge bg-purple-success">
                                    ✓ Seleccionado
                                  </span>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>


                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-purple btn-lg"
                    disabled={votacionCerrada}
                  >
                    Registrar Voto
                  </button>
                  <button
                    type="button"
                    className="btn btn-purple-danger"
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
              <div className="card-header bg-purple-success text-white">
                <h4 className="mb-0">📊 Estadísticas Generales</h4>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="border p-3 rounded" style={{ backgroundColor: 'white' }}>
                      <h5 style={{ color: '#333' }}>Total de Votos</h5>
                      <h2 style={{ color: 'var(--purple-primary)' }}>{totalVotos}</h2>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border p-3 rounded bg-purple-success text-white">
                      <h5>🏆 Mayor %</h5>
                      <h6>{ganador.marca} {ganador.modelo}</h6>
                      <h3>{ganador.porcentaje.toFixed(2)}%</h3>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border p-3 rounded bg-purple-danger text-white">
                      <h5>📉 Menor %</h5>
                      <h6>{ultimoLugar.marca} {ultimoLugar.modelo}</h6>
                      <h3>{ultimoLugar.porcentaje.toFixed(2)}%</h3>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border p-3 rounded bg-purple-warning text-white">
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
              <div className="card-header bg-purple-dark text-white">
                <h4 className="mb-0">📋 Tabla de Resultados (Ordenado de Mayor a Menor)</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover">
                    <thead className="bg-purple-dark">
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
                        <tr key={v.vehiculo} style={v.numero === 1 ? { backgroundColor: 'rgba(168, 85, 247, 0.2)' } : {}}>
                          <td><strong>{v.numero}</strong></td>
                          <td>{v.marca}</td>
                          <td>{v.modelo}</td>
                          <td><span className="badge bg-purple-primary">{v.votos}</span></td>
                          <td><strong>{v.porcentaje.toFixed(2)}%</strong></td>
                          <td>
                            <span className={`badge ${
                              v.clasificacion === 'Dominio Absoluto' ? 'bg-purple-success' :
                              v.clasificacion === 'Alta Preferencia' ? 'bg-purple-medium' :
                              v.clasificacion === 'Preferencia Media' ? 'bg-purple-warning' :
                              'bg-purple-light'
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
                                    const parent = e.target.parentNode;
                                    e.target.style.display = 'none';
                                    const fallbackDiv = document.createElement('div');
                                    fallbackDiv.className = 'bg-light p-2 rounded d-flex align-items-center justify-content-center';
                                    fallbackDiv.style.cssText = 'width: 150px; height: 100px;';
                                    fallbackDiv.innerHTML = '<small class="text-muted">Imagen no disponible</small>';
                                    parent.appendChild(fallbackDiv);
                                  }}
                                />
                              ) : (
                                <div className="bg-light p-2 rounded d-flex align-items-center justify-content-center" style={{ width: '150px', height: '100px' }}>
                                  <small className="text-muted">Imagen no disponible</small>
                                </div>
                              )}
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
              <div className="card-header bg-purple-warning text-white">
                <h4 className="mb-0">🏅 Ranking Top 5</h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="bg-purple-warning">
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
              <div className="card-header bg-purple-info text-white">
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
                    <tr style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}>
                      <td><strong>🏆 Vehículo Ganador:</strong></td>
                      <td>{ganador.marca} {ganador.modelo} ({ganador.porcentaje.toFixed(2)}%)</td>
                    </tr>
                    <tr style={{ backgroundColor: 'rgba(126, 34, 206, 0.2)' }}>
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
                        <span className={`badge ${votacionCerrada ? 'bg-purple-danger' : 'bg-purple-success'}`}>
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

      {/* Gráfica de Barras */}
      {estadisticas.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-10 mx-auto">
            <div className="card shadow">
              <div className="card-header bg-purple-medium text-white">
                <h4 className="mb-0">📊 Gráfica de Votos</h4>
              </div>
              <div className="card-body">
                <div style={{ padding: '20px' }}>
                  {estadisticas.map((v, index) => {
                    const porcentajeDelMaximo = totalVotos > 0 ? (v.votos / totalVotos) * 100 : 0
                    return (
                      <div key={v.vehiculo} style={{ marginBottom: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '250px' }}>
                            <span style={{ fontWeight: 'bold', color: 'var(--purple-primary)', minWidth: '30px' }}>
                              {index === 0 && '🥇'}
                              {index === 1 && '🥈'}
                              {index === 2 && '🥉'}
                              {index > 2 && `${v.numero}°`}
                            </span>
                            <span style={{ fontWeight: '600', color: '#333' }}>
                              {v.marca} {v.modelo}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="badge bg-purple-primary">{v.votos} votos</span>
                            <span style={{ fontWeight: 'bold', color: 'var(--purple-primary)', minWidth: '60px', textAlign: 'right' }}>
                              {v.porcentaje.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '30px',
                          backgroundColor: 'rgba(196, 181, 253, 0.2)',
                          borderRadius: '15px',
                          overflow: 'hidden',
                          position: 'relative'
                        }}>
                          <div
                            style={{
                              width: `${porcentajeDelMaximo}%`,
                              height: '100%',
                              background: index === 0
                                ? 'linear-gradient(90deg, var(--purple-success), var(--purple-primary))'
                                : index === 1
                                ? 'linear-gradient(90deg, var(--purple-medium), var(--purple-primary))'
                                : index === 2
                                ? 'linear-gradient(90deg, var(--purple-warning), var(--purple-medium))'
                                : 'linear-gradient(90deg, var(--purple-light), var(--purple-medium))',
                              transition: 'width 1s ease-in-out',
                              borderRadius: '15px',
                              boxShadow: '0 2px 4px rgba(124, 58, 237, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              paddingRight: '10px'
                            }}
                          >
                            {porcentajeDelMaximo > 15 && (
                              <span style={{
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                              }}>
                                {v.votos}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <strong>Total de votos:</strong> {totalVotos}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay votos */}
      {estadisticas.length === 0 && (
        <div className="row">
          <div className="col-md-8 mx-auto">
            <div className="alert alert-purple text-center">
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
