from slugify import slugify as _slugify
import requests

def slugify(text: str) -> str:
    return _slugify(text)

def languages_to_str(langs: list[str]) -> str:
    return ",".join([x.strip() for x in langs if x.strip()])

def languages_from_str(s: str | None) -> list[str]:
    if not s:
        return []
    return [x for x in s.split(",") if x]

def geocode_location(query: str):
    """
    Transformă text (oraș / PLZ / adresă) în lat/lng folosind Nominatim
    """
    if not query:
        return None, None

    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": query,
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": "servicii-ro-germania"
    }

    try:
        r = requests.get(url, params=params, headers=headers, timeout=5)
        data = r.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception:
        pass

    return None, None