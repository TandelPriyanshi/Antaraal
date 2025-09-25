# NLP Model - Text Analysis & Motivation System

This project provides three main NLP functionalities:
1. **Text Summarization** - Extracts key points from paragraphs
2. **Mood Detection** - Analyzes sentiment and emotional state from text
3. **Motivational Support** - Provides encouraging messages based on detected mood

## Features

- **Smart Summarization**: Uses transformer models to create concise summaries
- **Emotion Analysis**: Detects mood states (positive, negative, neutral) with confidence scores
- **Adaptive Motivation**: Provides personalized motivational quotes and advice
- **REST API**: Easy-to-use web API for integration
- **Lightweight**: Optimized for performance and resource usage

## Setup

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Download required models:
```bash
python setup.py
```

3. Start the API server:
```bash
python api/main.py
```

## Usage

### API Endpoints

- `POST /analyze` - Complete analysis (summary + mood + motivation)
- `POST /summarize` - Text summarization only
- `POST /mood` - Mood detection only
- `POST /motivate` - Get motivational content

### Example

```python
import requests

text = "I had a really tough day at work. Everything went wrong and I feel overwhelmed."

response = requests.post("http://localhost:8000/analyze", json={"text": text})
result = response.json()

print("Summary:", result["summary"])
print("Mood:", result["mood"])
print("Motivation:", result["motivation"])
```

## Structure

- `models/` - NLP model implementations
- `data/` - Training data and resources
- `utils/` - Helper functions and utilities
- `api/` - REST API implementation
- `tests/` - Unit tests and examples
