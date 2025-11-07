import os
import whisper
import spacy
import stanfordnlp
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
import numpy as np

# ---------------------------------------------------------------
#                     Configuración de modelos
# ---------------------------------------------------------------

# Cargar modelo de spaCy en español
try:
    nlp_spacy = spacy.load("es_core_news_md")
except:
    # En caso de no estar instalado, instalarlo
    os.system("python -m spacy download es_core_news_md")
    nlp_spacy = spacy.load("es_core_news_md")

# Cargar modelo StanfordNLP (Pipeline)
nlp_stanford = stanfordnlp.Pipeline(
    lang='es',
    models_dir="./model/stanford",
    use_gpu=False  # Cambiar a True si tienes GPU compatible
)

# Configurar NLTK para tokenización
nltk.data.path.append("./model/nltk_data")


# --------------------------------------------------------------------
#                       Funciones principales
# --------------------------------------------------------------------

def transcribe_audio(audio_path):
    """
    Transcribe audio usando Whisper
    """
    model = whisper.load_model("small")
    result = model.transcribe(audio_path, language="es")
    return result["text"]


def analyze_text(text):
    """
    Analiza el texto usando spaCy, StanfordNLP y NLTK
    Calcula métricas de complejidad, diversidad léxica y un puntaje cognitivo
    """
    # Tokenización NLTK
    sentences = sent_tokenize(text)
    words = word_tokenize(text)
    
    total_words = len(words)
    total_sentences = len(sentences)
    avg_sentence_length = total_words / max(total_sentences, 1)

    # Análisis sintáctico spaCy
    doc_spacy = nlp_spacy(text)
    syntactic_complexity_spacy = np.mean([len([t for t in sent]) for sent in doc_spacy.sents])

    # Análisis StanfordNLP
    doc_stanford = nlp_stanford(text)
    syntactic_complexity_stanford = np.mean([len(sentence.words) for sentence in doc_stanford.sentences])

    # Diversidad léxica
    unique_words = len(set(words))
    lexical_diversity = unique_words / max(total_words, 1)

    # Puntaje cognitivo (0-100)
    # Promediando la complejidad y diversidad léxica
    score = ((lexical_diversity * 50) +
             (syntactic_complexity_spacy * 25 / max(total_sentences, 1)) +
             (syntactic_complexity_stanford * 25 / max(total_sentences, 1)))
    score = np.clip(score, 0, 100)

    return {
        "words": total_words,
        "sentences": total_sentences,
        "lexical_diversity": round(lexical_diversity, 3),
        "syntactic_complexity_spacy": round(syntactic_complexity_spacy, 3),
        "syntactic_complexity_stanford": round(syntactic_complexity_stanford, 3),
        "avg_sentence_length": round(avg_sentence_length, 3),
        "cognitive_score": round(score, 2)
    }


def process_audio(audio_path):
    """
    Función principal: Transcribe y analiza el audio
    """
    text = transcribe_audio(audio_path)
    results = analyze_text(text)
    return {
        "transcription": text,
        "analysis": results
    }


# -------------------------------
# Ejemplo de prueba
# -------------------------------
if __name__ == "__main__":
    sample_audio = "./audio_samples/test_audio.mp3"  # Cambia por tu audio
    if os.path.exists(sample_audio):
        output = process_audio(sample_audio)
        print(output)
    else:
        print("Coloca un archivo de audio en ./audio_samples/ llamado test_audio.mp3 para probar")
