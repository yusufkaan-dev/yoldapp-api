# YOLDAPP — RouteTemplate + DailyRoute (Faz-1) — DONE

## Çalışan Akış
1) Admin: RouteTemplate oluştur
2) Admin: RouteTemplate stop ekle
3) Driver: Template seç -> DailyRoute (snapshot) oluştur
4) Driver: start -> stops -> finish

## Seed verileri
- driver: driver99@yoldapp.local / driverpass
- student: Ahmet Yılmaz
- routeTemplateId (örnek): fa078ad4-40f0-492a-9bb5-7f20a23db241

## Driver test akışı (CLI)
Token’ı elle kopyalama yapmayın (JWT satır kırılınca invalid oluyor).
Token’ı login response içinden tek satır çekerek kullanın:

TOKEN="$(curl -sS -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"driver99@yoldapp.local\",\"password\":\"driverpass\",\"deviceId\":\"cli-driver\"}" \
  | sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p')"

curl -i http://localhost:3000/auth/me -H "Authorization: Bearer $TOKEN"

Daily select:
curl -i -X POST http://localhost:3000/driver/daily-routes/select \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"routeTemplateId\":\"<ROUTE_TEMPLATE_ID>\"}"

Start:
curl -i -X POST http://localhost:3000/driver/daily-routes/<DAILY_ROUTE_ID>/start \
  -H "Authorization: Bearer $TOKEN"

Stops:
curl -i http://localhost:3000/driver/daily-routes/<DAILY_ROUTE_ID>/stops \
  -H "Authorization: Bearer $TOKEN"

Finish:
curl -i -X POST http://localhost:3000/driver/daily-routes/<DAILY_ROUTE_ID>/finish \
  -H "Authorization: Bearer $TOKEN"

## Notlar / Debug
- Swagger’da “Missing Authorization header” görülürse:
  - doğru user ile login + authorize yapılmalı
  - token satır kırılmamalı
- Git Bash’te JSON/Token satır kırılması en sık “Invalid token” sebebi.
