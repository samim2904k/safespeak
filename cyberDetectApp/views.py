from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse_lazy
from translatepy import Translator
from langdetect import detect
from langdetect.lang_detect_exception import LangDetectException
import json
import os
import requests
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer

# Load ML resources
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, r'chat\ml_models\LinearSVCTuned.pkl')
VECTORIZER_PATH = os.path.join(BASE_DIR, r'chat\ml_models\tfidfvectoizer.pkl')
STOPWORDS_PATH = os.path.join(BASE_DIR, r'chat\ml_models\stopwords.txt')

# Initialize global variables
stopwords = []
vectorizer = None
model = None

# Load resources
try:
    # Load stopwords
    with open(STOPWORDS_PATH, "r") as file:
        stopwords = file.read().splitlines()

    # Load vectorizer vocabulary
    with open(VECTORIZER_PATH, "rb") as file:
        vocabulary = pickle.load(file)
        if not isinstance(vocabulary, dict):
            raise ValueError("Loaded vocabulary is not a dictionary.")

    vectorizer = TfidfVectorizer(stop_words=stopwords, lowercase=True, vocabulary=vocabulary)

    # Load model
    with open(MODEL_PATH, "rb") as file:
        model = pickle.load(file)

except FileNotFoundError as e:
    raise RuntimeError(f"File not found: {e}")
except Exception as e:
    raise RuntimeError(f"Error loading resources: {e}")

# User login view
def user_login(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("email")
            password = data.get("password")
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            request.session['logged_in'] = True
            return JsonResponse({'message': 'Login successful', 'redirect_url': '/chatBot/'})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

    return render(request, "login.html")

# ChatBot view
@login_required(login_url='/')
def chatBot(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse_lazy('login'))

    return render(request, 'messenger.html')

langDict = {
    'en': 'English',
    'fi': 'English',
    'te': 'Telugu',
    'mr': 'Hindi'
}

@login_required(login_url='/')
def detectBully(request):
    if request.method == 'POST':
        # Ensure the request is JSON
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Extract message from request
        message = data.get('message', '')
        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)
        
        if message.lower() == 'hello':
            # Return prediction
            return JsonResponse({
                'prediction': 'Hello!  Please provide the text to check the authenticity.',
            })

        try:
            # Detect language
            try:
                detected_lang = detect(message)
                detected_lang_name = langDict.get(detected_lang, 'Unknown')
                print(f"Detected Language: {detected_lang_name} ({detected_lang})")
            except LangDetectException:
                return JsonResponse({'error': 'Unable to detect language'}, status=500)

            # Translate to English if necessary
            if detected_lang != 'en' or detected_lang != 'fi':
                translator = Translator()
                try:
                    translated_message = translator.translate(message, destination_language="English").result
                except Exception as e:
                    return JsonResponse({'error': f'Error translating to English: {str(e)}'}, status=500)
            else:
                translated_message = message

            # Perform prediction
            transformed_input = vectorizer.fit_transform([translated_message])
            prediction = model.predict(transformed_input)[0]
            prediction_text = 'Cyberbullying Detected' if prediction == 1 else 'No Cyberbullying'

            # Translate prediction back to the original language if needed
            if detected_lang != 'en' or detected_lang != 'fi':
                try:
                    prediction_text = translator.translate(prediction_text, destination_language=detected_lang).result
                except Exception as e:
                    return JsonResponse({'error': f'Error translating result: {str(e)}'}, status=500)

            # Return prediction
            return JsonResponse({
                'prediction': prediction_text,
                'language': detected_lang_name
            })

        except Exception as e:
            import traceback
            print(traceback.format_exc())  # Detailed traceback for debugging
            return JsonResponse({'error': f'Error processing request: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

def log_out(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({'message': 'Logged out successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request'}, status=400)