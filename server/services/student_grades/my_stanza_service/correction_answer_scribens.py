import requests
import urllib3
import threading

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class ScribensService:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._init_session()

        return cls._instance

    def _init_session(self):
        self.session = requests.Session()

        self.session.headers.update({
            "User-Agent": "Mozilla/5.0"
        })

    def correct_text(self, text: str) -> str:
        url = "https://www.scribens.fr/Scribens/OtherAlg_Ref_Servlet"

        data = {
            "FunctionName": "Get_Correction",
            "Plugin": "Website_desktop",
            "Text": text,
            "IdLanguage": "he",
            "IdLangDisplay": "he",
            "Tone": "nope",
            "Settings": "points:none|title:no|conclusion:no|inclusive:no|function:None"
        }

        try:
            res = self.session.post(
                url,
                data=data,
                verify=False,
                timeout=15
            )

            if res.status_code != 200:
                return text

            result = res.json()

            return result.get("ResultSt", text)

        except Exception:
            return text


