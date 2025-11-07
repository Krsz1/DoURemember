import stanfordnlp
import nltk
import os

# Crear carpeta de modelos si no existe
os.makedirs("./model/stanford", exist_ok=True)
os.makedirs("./model/nltk_data", exist_ok=True)

# Descargar modelo de StanfordNLP español
stanfordnlp.download('es', resource_dir="./model/stanford")

# Descargar recurso de NLTK
nltk.download('punkt', download_dir="./model/nltk_data")

print("Modelos descargados correctamente ✅")
