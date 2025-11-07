from flask import Flask, request, jsonify
from process_audio import process_audio
import os
import tempfile

app = Flask(__name__)

# Carpeta temporal para audios subidos
UPLOAD_FOLDER = "./audio_samples"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/analyze", methods=["POST"])
def analyze_audio():
    """
    Endpoint para recibir un audio y devolver análisis cognitivo
    """
    if "audio" not in request.files:
        return jsonify({"error": "No se envió ningún archivo de audio"}), 400

    file = request.files["audio"]

    # Guardar el archivo temporalmente
    temp_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(temp_path)

    try:
        # Procesar el audio
        result = process_audio(temp_path)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Borrar el archivo temporal después del análisis
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return jsonify(result), 200


if __name__ == "__main__":
    # Ejecutar la API en puerto 5001
    app.run(host="0.0.0.0", port=5001, debug=True)
