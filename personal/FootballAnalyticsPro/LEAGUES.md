# 🌍 Ligas Disponibles - Football Analytics Pro

## Ligas Principales Europeas

### 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Premier League | 39 | 2024, 2025 |
| Championship | 40 | 2024, 2025 |
| League One | 41 | 2024, 2025 |
| League Two | 42 | 2024, 2025 |
| FA Cup | 45 | 2024, 2025 |
| EFL Cup | 48 | 2024, 2025 |

### 🇪🇸 España
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| La Liga | 140 | 2024, 2025 |
| Segunda División | 141 | 2024, 2025 |
| Copa del Rey | 143 | 2024, 2025 |

### 🇮🇹 Italia
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Serie A | 135 | 2024, 2025 |
| Serie B | 136 | 2024, 2025 |
| Coppa Italia | 137 | 2024, 2025 |

### 🇩🇪 Alemania
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Bundesliga | 78 | 2024, 2025 |
| 2. Bundesliga | 79 | 2024, 2025 |
| DFB Pokal | 81 | 2024, 2025 |

### 🇫🇷 Francia
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Ligue 1 | 61 | 2024, 2025 |
| Ligue 2 | 62 | 2024, 2025 |
| Coupe de France | 66 | 2024, 2025 |

### 🇵🇹 Portugal
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Primeira Liga | 94 | 2024, 2025 |
| Segunda Liga | 95 | 2024, 2025 |
| Taça de Portugal | 96 | 2024, 2025 |

### 🇳🇱 Países Bajos
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Eredivisie | 88 | 2024, 2025 |
| Eerste Divisie | 89 | 2024, 2025 |

## Competiciones Internacionales

### 🌍 UEFA
| Competición | ID | Temporadas Disponibles |
|-------------|----|-----------------------|
| Champions League | 2 | 2024, 2025 |
| Europa League | 3 | 2024, 2025 |
| Conference League | 848 | 2024, 2025 |
| Nations League | 5 | 2024, 2025 |
| Euro Championship | 4 | 2024 |

### 🌎 América
| Liga | País | ID | Temporadas |
|------|------|----|------------|
| MLS | USA | 253 | 2024, 2025 |
| Liga MX | México | 262 | 2024, 2025 |
| Brasileirão | Brasil | 71 | 2024, 2025 |
| Copa Libertadores | Sudamérica | 13 | 2024, 2025 |
| Copa Sudamericana | Sudamérica | 11 | 2024, 2025 |

### 🌏 Otras Regiones
| Liga | País | ID | Temporadas |
|------|------|----|------------|
| Premier League | Rusia | 235 | 2024, 2025 |
| Süper Lig | Turquía | 203 | 2024, 2025 |
| Saudi Pro League | Arabia Saudita | 307 | 2024, 2025 |
| J1 League | Japón | 98 | 2024, 2025 |

## Ligas Latinoamericanas

### 🇦🇷 Argentina
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Liga Profesional | 128 | 2024, 2025 |
| Copa Argentina | 129 | 2024, 2025 |

### 🇧🇷 Brasil
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Série A | 71 | 2024, 2025 |
| Série B | 72 | 2024, 2025 |
| Copa do Brasil | 73 | 2024, 2025 |

### 🇨🇱 Chile
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Primera División | 265 | 2024, 2025 |

### 🇨🇴 Colombia
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Primera A | 239 | 2024, 2025 |

### 🇲🇽 México
| Liga | ID | Temporadas Disponibles |
|------|----|-----------------------|
| Liga MX | 262 | 2024, 2025 |
| Copa MX | 263 | 2024, 2025 |

## Cómo Usar los IDs

### Ejemplo 1: Obtener Clasificación de La Liga
```typescript
// En tu componente Angular
this.footballDataService.getStandings(140, 2024).subscribe(data => {
  console.log('Clasificación La Liga:', data);
});
```

### Ejemplo 2: Obtener Partidos de la Champions League
```typescript
this.footballDataService.getMatchesByLeague(2, 2024).subscribe(data => {
  console.log('Partidos Champions:', data);
});
```

### Ejemplo 3: Obtener Equipos de la Premier League
```typescript
this.footballDataService.getTeamsByLeague(39, 2024).subscribe(data => {
  console.log('Equipos Premier League:', data);
});
```

## Endpoints REST

### Obtener Ligas
```
GET http://localhost:8080/api/leagues/season/2024
```

### Obtener Clasificación
```
GET http://localhost:8080/api/leagues/{leagueId}/standings/season/2024
```

### Obtener Partidos de una Liga
```
GET http://localhost:8080/api/matches/league/{leagueId}/season/2024
```

### Obtener Equipos de una Liga
```
GET http://localhost:8080/api/teams/league/{leagueId}/season/2024
```

## Notas Importantes

1. **Temporadas Disponibles:** La mayoría de las ligas tienen datos desde 2010 hasta la actualidad.
2. **Formato de Temporada:** Usa el año de inicio (ej: 2024 para la temporada 2024/2025).
3. **Límite de API:** Con el plan gratuito de API-Football tienes 100 requests/día.
4. **Caché:** Las consultas están cacheadas para optimizar el uso de la API.
5. **Actualizaciones:** Los datos se actualizan automáticamente cada 30 segundos para partidos en vivo.

## Ligas Recomendadas para Empezar

Para tus primeras pruebas, te recomiendo usar estas ligas que tienen más datos y actividad:

1. **Premier League (39)** - Inglaterra
2. **La Liga (140)** - España
3. **Champions League (2)** - Europa
4. **Bundesliga (78)** - Alemania
5. **Serie A (135)** - Italia

---

**Nota:** Para obtener la lista completa y actualizada de todas las ligas disponibles, puedes hacer una petición a:
```
GET http://localhost:8080/api/leagues/season/2024
```

**Desarrollado por Luis Cendán © 2026**
