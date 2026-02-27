from flask import Flask, render_template
import random

app = Flask(__name__)

@app.route('/')
def home():
    # Aqui você pode passar variáveis como o título da HQ ou sinopse
    dados_hq = {
        "titulo": "Cacau em: Conhecendo a UFABC",
        "autor": "Ryan Corazza e Pâmela Campos",
        "descricao": "Conheça o Cacau e a Betty e descubra como a Universidade Federal do ABC (UFABC) funciona nesta aventura muito divertida!"
    }
    return render_template('index.html', hq=dados_hq)

if __name__ == '__main__':
    app.run(debug=True)