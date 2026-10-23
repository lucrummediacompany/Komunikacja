# Trading Zones x402 SDK — instrukcja po polsku

To repozytorium zawiera klienta i gotowe przykłady botów kupujących przez x402 pięć produktów Trading Zones:

- osobne setupy 4H dla BTC, ETH, XRP i ONDO,
- TZ SELECT / 4H — jeden setup wybrany z czterech rynków.

Cena jednego aktualnego pakietu wynosi 0,03 USDC. Pakiet zawiera decyzję, entry reference, SL, TP, zabezpieczenia płynnościowe LQ, wskaźniki, ważność oraz możliwe do zweryfikowania dowody wyników.

## Start

1. Zainstaluj Node.js 20.19 lub nowszy.
2. Uruchom `npm install`.
3. Skopiuj `.env.example` do `.env` i wpisz trzy dane CDP.
4. Zasil wyświetlony adres portfela natywnym USDC w sieci Base.
5. Uruchom `npm run buy:http -- BTC` albo `npm run buy:mcp -- TZ-SELECT`.

Bot `npm run bot:4h -- BTC` zapisuje wynik lokalnie i nie kupuje ponownie, dopóki poprzedni pakiet pozostaje ważny.

SDK nie otwiera pozycji na giełdzie. Dostarcza agentowi kompletny pakiet decyzyjny; zasady egzekucji, limity ryzyka i ewentualne zlecenia pozostają po stronie użytkownika.
