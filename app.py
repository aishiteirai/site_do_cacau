from flask import Flask, render_template
import random

app = Flask(__name__)

@app.route('/')
def home():
    # Aqui você pode passar variáveis como o título da HQ ou sinopse
    dados_hq = {
        "titulo": "Cacau em: Conhecendo a UFABC",
        "autor": "Ryan Corazza",
        "descricao": "Conheça o Cacau e a Betty e embarque nesta aventura muito divertida onde descobrem como a Universidade Federal do ABC funciona!"
    }
    return render_template('index.html', hq=dados_hq)

if __name__ == '__main__':
    app.run(debug=True)