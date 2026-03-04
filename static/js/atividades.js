document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DA CRUZADINHA 2D ---
    const cwGridElem = document.getElementById('crossword-grid');
    const cols = 12;
    const rows = 13;

    let cwMatrix = Array(rows).fill().map(() => Array(cols).fill(null));

    const cwWords = [
        {id: 1, word: "AREIAO", x: 4, y: 1, dir: "H", arrow: "→"},
        {id: 2, word: "FRETADO", x: 5, y: 0, dir: "V", arrow: "↓"},
        {id: 3, word: "SANTO ANDRE", x: 1, y: 6, dir: "H", arrow: "→"},
        {id: 4, word: "UFABC", x: 2, y: 4, dir: "V", arrow: "↓"},
        {id: 5, word: "LCH", x: 1, y: 8, dir: "H", arrow: "→"},
        {id: 6, word: "ALPHA", x: 7, y: 6, dir: "V", arrow: "↓"},
        {id: 7, word: "BIOLOGIA", x: 0, y: 10, dir: "H", arrow: "→"},
        {id: 8, word: "LEILA", x: 1, y: 8, dir: "V", arrow: "↓"}
    ];

    cwWords.forEach(w => {
        for (let i = 0; i < w.word.length; i++) {
            let cx = w.dir === 'H' ? w.x + i : w.x;
            let cy = w.dir === 'V' ? w.y + i : w.y;
            let char = w.word[i];

            if (!cwMatrix[cy][cx]) {
                cwMatrix[cy][cx] = {letter: char, labels: []};
            }
            if (i === 0) {
                cwMatrix[cy][cx].labels.push(`${w.id}${w.arrow}`);
            }
        }
    });

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let cellData = cwMatrix[r][c];
            let cellDiv = document.createElement('div');
            cellDiv.className = 'cw-cell';

            if (cellData) {
                if (cellData.letter === ' ') {
                    let blackBox = document.createElement('div');
                    blackBox.className = 'cw-black-box';
                    cellDiv.appendChild(blackBox);
                } else {
                    let container = document.createElement('div');
                    container.className = 'cw-input-container';

                    if (cellData.labels.length > 0) {
                        let numSpan = document.createElement('span');
                        numSpan.className = 'cw-numero';
                        numSpan.textContent = cellData.labels.join(', ');
                        container.appendChild(numSpan);
                    }

                    let input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.className = 'cw-input';
                    input.dataset.letter = cellData.letter;

                    input.addEventListener('input', function () {
                        this.classList.remove('wrong');
                        this.value = this.value.toUpperCase();
                    });

                    container.appendChild(input);
                    cellDiv.appendChild(container);
                }
            }
            cwGridElem.appendChild(cellDiv);
        }
    }

    document.getElementById('btn-validar-cruzadinha').addEventListener('click', () => {
        let allCorrect = true;
        let hasEmpty = false;
        const inputs = document.querySelectorAll('.cw-input');

        inputs.forEach(input => {
            const val = input.value.toUpperCase();
            if (val === "") {
                hasEmpty = true;
                allCorrect = false;
                input.classList.remove('wrong', 'correct');
            } else if (val === input.dataset.letter) {
                input.classList.add('correct');
                input.classList.remove('wrong');
            } else {
                input.classList.add('wrong');
                input.classList.remove('correct');
                allCorrect = false;
            }
        });

        const msgBox = document.getElementById('crossword-msg');
        if (allCorrect) {
            msgBox.textContent = "🎉 Parabéns! Você completou as palavras cruzadas perfeitamente!";
            msgBox.style.color = "green";
            msgBox.style.borderColor = "green";
            msgBox.style.display = 'block';
        } else if (hasEmpty) {
            msgBox.textContent = "Continue tentando! Algumas palavras ainda estão em branco.";
            msgBox.style.color = "#8B0000";
            msgBox.style.borderColor = "#8B0000";
            msgBox.style.background = "#FFB6C1";
            msgBox.style.display = 'block';
        } else {
            msgBox.textContent = "Algumas letras estão incorretas (em vermelho). Tente consertá-las!";
            msgBox.style.color = "#8B0000";
            msgBox.style.borderColor = "#8B0000";
            msgBox.style.background = "#FFB6C1";
            msgBox.style.display = 'block';
        }
    });

    // --- 2. LÓGICA DO CAÇA-PALAVRAS ---
    const wsTargetWords = ["ALPHA", "BIBLIOTECA", "AUDITÓRIOS", "PISOVERMELHO", "ZETA", "GAMA", "BETA", "OMEGA"];
    const wsRows = 12;
    const wsCols = 20;
    let wsMatrix = Array(wsRows).fill().map(() => Array(wsCols).fill(''));

    const wsPlacements = [
        {word: "PISOVERMELHO", r: 10, c: 2, dr: 0, dc: 1},
        {word: "AUDITÓRIOS", r: 1, c: 5, dr: 0, dc: 1},
        {word: "BIBLIOTECA", r: 0, c: 1, dr: 1, dc: 0},
        {word: "OMEGA", r: 2, c: 3, dr: 1, dc: 1},
        {word: "ALPHA", r: 8, c: 17, dr: -1, dc: 0},
        {word: "ZETA", r: 3, c: 15, dr: 0, dc: -1},
        {word: "GAMA", r: 7, c: 10, dr: -1, dc: 1},
        {word: "BETA", r: 11, c: 15, dr: 0, dc: 1}
    ];

    wsPlacements.forEach(p => {
        for (let i = 0; i < p.word.length; i++) {
            wsMatrix[p.r + i * p.dr][p.c + i * p.dc] = p.word[i];
        }
    });

    const letrasNormais = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letrasAcentuadas = "ÁÉÍÓÚÂÊÎÔÛÃÕÇ";

    for (let r = 0; r < wsRows; r++) {
        for (let c = 0; c < wsCols; c++) {
            if (wsMatrix[r][c] === '') {
                if (Math.random() < 0.15) {
                    wsMatrix[r][c] = letrasAcentuadas[Math.floor(Math.random() * letrasAcentuadas.length)];
                } else {
                    wsMatrix[r][c] = letrasNormais[Math.floor(Math.random() * letrasNormais.length)];
                }
            }
        }
    }

    const wsGridElem = document.getElementById('wordsearch-grid');
    const wsListElem = document.getElementById('wordsearch-list');
    let wordsFoundCount = 0;

    wsTargetWords.forEach(word => {
        let li = document.createElement('li');
        li.id = "li-" + word;
        li.textContent = word;
        wsListElem.appendChild(li);
    });

    for (let r = 0; r < wsRows; r++) {
        for (let c = 0; c < wsCols; c++) {
            let cell = document.createElement('div');
            cell.className = 'ws-cell';
            cell.textContent = wsMatrix[r][c];
            cell.dataset.r = r;
            cell.dataset.c = c;

            cell.addEventListener('click', () => {
                if (!cell.classList.contains('found')) cell.classList.toggle('selected');
            });
            wsGridElem.appendChild(cell);
        }
    }

    function isStraightLine(cells) {
        if (cells.length < 2) return false;

        let sorted = Array.from(cells).sort((a, b) => {
            let rA = parseInt(a.dataset.r), cA = parseInt(a.dataset.c);
            let rB = parseInt(b.dataset.r), cB = parseInt(b.dataset.c);
            if (rA !== rB) return rA - rB;
            return cA - cB;
        });

        let r0 = parseInt(sorted[0].dataset.r), c0 = parseInt(sorted[0].dataset.c);
        let r1 = parseInt(sorted[1].dataset.r), c1 = parseInt(sorted[1].dataset.c);

        let dr = r1 - r0;
        let dc = c1 - c0;

        if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return false;
        if (dr === 0 && dc === 0) return false;

        for (let i = 1; i < sorted.length - 1; i++) {
            let cr = parseInt(sorted[i].dataset.r), cc = parseInt(sorted[i].dataset.c);
            let nr = parseInt(sorted[i + 1].dataset.r), nc = parseInt(sorted[i + 1].dataset.c);
            if (nr - cr !== dr || nc - cc !== dc) return false;
        }
        return true;
    }

    document.getElementById('btn-validar-palavra').addEventListener('click', () => {
        const selectedCells = document.querySelectorAll('.ws-cell.selected');
        if (selectedCells.length === 0) return;

        if (!isStraightLine(selectedCells) && selectedCells.length > 1) {
            selectedCells.forEach(cell => cell.classList.remove('selected'));
            return;
        }

        let sortedCells = Array.from(selectedCells).sort((a, b) => {
            if (parseInt(a.dataset.r) !== parseInt(b.dataset.r)) return parseInt(a.dataset.r) - parseInt(b.dataset.r);
            return parseInt(a.dataset.c) - parseInt(b.dataset.c);
        });

        let selectedString = "";
        let selectedStringReverse = "";
        sortedCells.forEach(cell => {
            selectedString += cell.textContent;
            selectedStringReverse = cell.textContent + selectedStringReverse;
        });

        let foundWord = null;
        wsTargetWords.forEach(word => {
            if (selectedString === word || selectedStringReverse === word) foundWord = word;
        });

        if (foundWord) {
            sortedCells.forEach(cell => {
                cell.classList.remove('selected');
                cell.classList.add('found');
            });
            const li = document.getElementById("li-" + foundWord);
            if (!li.classList.contains('found')) {
                li.classList.add('found');
                wordsFoundCount++;
                if (wordsFoundCount === wsTargetWords.length) {
                    document.getElementById('ws-msg').style.display = 'block';
                }
            }
        } else {
            selectedCells.forEach(cell => cell.classList.remove('selected'));
        }
    });
});