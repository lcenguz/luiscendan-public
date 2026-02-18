# 📋 Mapeo Completo de Endpoints BeSoccer API

## 🔗 Estructura de la API

**Base URL:** `http://apiclient.besoccerapps.com/scripts/api/api.php`

**Formato de Request:**
```
?key={{APIKEY}}&req={endpoint_name}&format=json&{parametros_adicionales}
```

---

## 📊 NIVEL 1: Competiciones y Partidos Básicos

| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 1 | Competiciones | `categories` | - | `?req=categories&format=json` |
| 2 | Estado competición | `league_status` | `id`, `year` | `?req=league_status&id=1&year=2023&format=json` |
| 3 | Detalle competición | `league_detail` | `id` | `?req=league_detail&id=1&format=json` |
| 4 | Competiciones por continente | `categories_continent` | `continent` | `?req=categories_continent&continent=europe&format=json` |
| 5 | Competiciones top | `categories_top` | - | `?req=categories_top&format=json` |
| 6 | Detalle completo competición | `league_full` | `id`, `year` | `?req=league_full&id=1&year=2023&format=json` |
| 7 | Clasificación | `league_table` | `id`, `year` | `?req=league_table&id=1&year=2023&format=json` |
| 8 | Detalle fases competición | `league_phases` | `id`, `phase_id` | `?req=league_phases&id=1&phase_id=1&format=json` |
| 9 | Temporadas | `league_seasons` | `id` | `?req=league_seasons&id=1&format=json` |
| 10 | Equipos | `league_teams` | `id`, `year` | `?req=league_teams&id=1&year=2023&format=json` |
| 11 | Partidos en directo | `live_matches` | `tz` (opcional) | `?req=live_matches&tz=Europe/Madrid&format=json` |
| 12 | Partidos del día | `today_matches` | `tz` (opcional) | `?req=today_matches&tz=Europe/Madrid&format=json` |
| 13 | Partidos por jornada | `round_matches` | `id`, `round`, `year` | `?req=round_matches&id=1&round=10&year=2023&format=json` |
| 14 | Cuadro partidos | `bracket` | `id`, `year` | `?req=bracket&id=1&year=2023&format=json` |
| 15 | Horarios modificados | `modified_schedules` | - | `?req=modified_schedules&format=json` |

---

## 📊 NIVEL 2: Equipos, Jugadores y Detalles Avanzados

### Competiciones Avanzadas
| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 16 | Fichajes | `transfer_market` | `id` (opcional), `filter` | `?req=transfer_market&id=1&format=json` |
| 17 | Resumen de competición | `league_summary` | `id`, `year` | `?req=league_summary&id=1&year=2023&format=json` |
| 18 | Árbitros competición | `league_referees` | `id`, `year` | `?req=league_referees&id=1&year=2023&format=json` |
| 19 | Quiniela / Quinigol | `betting_info` | `id` | `?req=betting_info&id=1&format=json` |
| 20 | Cruces | `pairings` | `id`, `year` | `?req=pairings&id=1&year=2023&format=json` |
| 21 | Estadísticas competición | `league_stats` | `id`, `year` | `?req=league_stats&id=1&year=2023&format=json` |

### Equipos
| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 22 | Detalle equipo | `team_detail` | `id` | `?req=team_detail&id=486&format=json` |
| 23 | Obtener equipos | `team_search` | `q` (query) | `?req=team_search&q=Barcelona&format=json` |
| 24 | Competición troncal del equipo | `team_main_league` | `id` | `?req=team_main_league&id=486&format=json` |
| 25 | Información de equipo | `team_info` | `id` | `?req=team_info&id=486&format=json` |
| 26 | Plantilla de equipo | `team_squad` | `id` | `?req=team_squad&id=486&format=json` |
| 27 | Plantilla por competición | `team_squad_league` | `team_id`, `league_id` | `?req=team_squad_league&team_id=486&league_id=1&format=json` |
| 28 | Partidos por equipo | `team_matches` | `id`, `year` (opcional) | `?req=team_matches&id=486&year=2023&format=json` |

### Jugadores
| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 29 | Obtener equipo jugador | `player_current_team` | `id` | `?req=player_current_team&id=12345&format=json` |
| 30 | Fichajes jugador completo | `player_transfers` | `id` | `?req=player_transfers&id=12345&format=json` |

### Partidos Avanzados
| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 31 | Directo de partido | `match_live` | `id` | `?req=match_live&id=123456&format=json` |
| 32 | Alineaciones de partido | `match_lineups` | `id` | `?req=match_lineups&id=123456&format=json` |
| 33 | Partidos del mes | `monthly_matches` | `year`, `month` | `?req=monthly_matches&year=2023&month=10&format=json` |
| 34 | Detalle de partido | `match_detail` | `id` | `?req=match_detail&id=123456&format=json` |
| 35 | TV y partidos | `match_broadcast` | `id` | `?req=match_broadcast&id=123456&format=json` |
| 36 | Consultar partidos del día | `daily_matches_enhanced` | `date` (opcional) | `?req=daily_matches_enhanced&date=2023-10-15&format=json` |

### Otros
| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 37 | Agenda | `sports_agenda` | - | `?req=sports_agenda&format=json` |

---

## 📊 NIVEL 3: Estadísticas Especializadas e Históricos

### Estadísticas de Equipos
| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 38 | Estadísticas de equipo en partido | `team_match_stats` | `team_id`, `match_id` | `?req=team_match_stats&team_id=486&match_id=123456&format=json` |
| 39 | Estadísticas de equipo en temporadas | `team_season_stats` | `id`, `year` | `?req=team_season_stats&id=486&year=2023&format=json` |
| 40 | Estadísticas avanzadas de equipo | `team_complete_stats` | `id` | `?req=team_complete_stats&id=486&format=json` |
| 41 | Histórico de jugadores en equipo | `team_player_history` | `id` | `?req=team_player_history&id=486&format=json` |
| 42 | Historial equipos | `team_history` | `id` | `?req=team_history&id=486&format=json` |

### Jugadores Avanzado
| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 43 | Comparador de jugadores | `player_compare` | `player1`, `player2` | `?req=player_compare&player1=123&player2=456&format=json` |
| 44 | Información detallada jugador | `player_detailed` | `id` | `?req=player_detailed&id=12345&format=json` |
| 45 | Información lesiones jugador | `player_injuries` | `id` | `?req=player_injuries&id=12345&format=json` |
| 46 | Detalle partidos jugador | `player_match_details` | `player_id`, `match_id` | `?req=player_match_details&player_id=123&match_id=456&format=json` |
| 47 | Partidos jugador en temporada | `player_season_matches` | `id`, `year` | `?req=player_season_matches&id=12345&year=2023&format=json` |
| 48 | Palmarés del jugador extendido | `player_trophies` | `id` | `?req=player_trophies&id=12345&format=json` |
| 49 | Temporadas del jugador | `player_seasons` | `id` | `?req=player_seasons&id=12345&format=json` |
| 50 | Información equipos jugador | `player_teams` | `id` | `?req=player_teams&id=12345&format=json` |
| 51 | Trayectoria del jugador | `player_career` | `id` | `?req=player_career&id=12345&format=json` |
| 52 | Estado del jugador | `player_status` | `id` | `?req=player_status&id=12345&format=json` |

### Otros Nivel 3
| # | Nombre | Parámetro `req` | Parámetros Adicionales | Ejemplo |
|---|--------|-----------------|------------------------|---------|
| 53 | Fichajes por competición | `league_transfers_detailed` | `id`, `year` | `?req=league_transfers_detailed&id=1&year=2023&format=json` |
| 54 | Detalle de partido histórico | `match_historical` | `id` | `?req=match_historical&id=123456&format=json` |
| 55 | Trayectoria entrenador | `coach_career` | `id` | `?req=coach_career&id=789&format=json` |

---

## 🔑 Parámetros Comunes

| Parámetro | Descripción | Valores | Obligatorio |
|-----------|-------------|---------|-------------|
| `key` | API Key | Tu clave de API | ❌ NO (API pública) |
| `req` | Endpoint solicitado | Ver tabla arriba | ✅ SÍ |
| `format` | Formato de respuesta | `json`, `xml` | ✅ SÍ (usar `json`) |
| `tz` | Zona horaria | `Europe/Madrid`, `America/New_York`, etc. | ❌ NO |
| `id` | ID de la entidad | Número entero | Depende del endpoint |
| `year` | Año/Temporada | `2023`, `2024`, etc. | Depende del endpoint |

---

## 📝 Notas Importantes

1. **Sin API Key requerida**: La API de BeSoccer es pública y no requiere autenticación
2. **Formato JSON**: Siempre usar `format=json` para respuestas estructuradas
3. **Zona horaria**: El parámetro `tz` es opcional pero recomendado para partidos en vivo
4. **IDs**: Los IDs de ligas, equipos y jugadores se obtienen de otros endpoints
5. **Temporadas**: Usar el año de inicio de la temporada (ej: 2023 para 2023/2024)

---

**Última actualización:** 2026-01-03
**Desarrollado por Luis Cendán**
