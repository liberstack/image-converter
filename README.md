# jpg-press

Conversor e compressor de imagens client-side. Qualquer formato entra — PNG, WebP, o que for — e sai em JPG, no tamanho que você mandar.

Sem backend, sem upload, sem dependências externas.

---

## Como funciona

O arquivo é lido via `createImageBitmap()`, desenhado em um `<canvas>` sobre um fundo branco (JPG não tem canal alpha) e exportado como JPG através de `canvas.toBlob()`, com qualidade fixa em 80%. Todo o processamento ocorre no navegador.

---

## Uso

```
git clone https://github.com/devgbr86/jpg-press.git
cd jpg-press
```

Abra `index.html` diretamente no navegador. Nenhum servidor ou build necessário.

1. Selecione arquivos pelo botão ou arraste para a área de drop
2. Prensa individualmente ou use "Prensar Todas"
3. Cada card mostra o tamanho antes → depois, com a redução em %
4. Baixe os arquivos convertidos

---

## Arquitetura

```
index.html          — estrutura da página, carrega os scripts em ordem
style.css            — estilos globais
js/
├── utils.js         — escapeHtml, formatBytes, reductionPercent
├── store.js         — estado global das imagens carregadas
├── imageService.js  — loadImage, convertToJpg, generateThumbnail
├── ui.js            — thumbs, dropzone, controles
└── main.js          — orquestrador, ponto de entrada
```

A separação entre `imageService.js` e `utils.js` é intencional: o primeiro contém lógica de domínio (conversão e compressão de imagem), o segundo só funções puras sem contexto de negócio.

Os arquivos são scripts comuns (não ES modules) carregados em ordem via `<script>`, cada um expondo um namespace global (`Utils`, `Store`, `ImageService`, `UI`). Isso é proposital: módulos ES bloqueiam via CORS quando o HTML é aberto direto do disco (`file://`), então essa estrutura garante que o projeto funcione só com duplo-clique no `index.html`, sem precisar de servidor local.

A ordem de carregamento no `index.html` importa — cada script espera que o anterior já tenha rodado:

```html
<script src="./js/utils.js"></script>
<script src="./js/store.js"></script>
<script src="./js/imageService.js"></script>
<script src="./js/ui.js"></script>
<script src="./js/main.js"></script>
```

`main.js` é o último porque ele é quem consome `Store`, `ImageService` e `UI` — se rodar antes deles, a página carrega sem erro visível, mas nenhum clique ou drop funciona.

---

## Tecnologias

- HTML5, CSS3, JavaScript ES6, scripts globais (sem `import`/`export`, funciona via `file://`)
- Canvas API — `createImageBitmap()`, `toBlob()`
- `URL.createObjectURL()` com `revokeObjectURL()` para evitar memory leak

---

## Observações

- Formato de saída é sempre JPG — essa é a única coisa que a ferramenta faz, de propósito
- Transparência de PNG/WebP vira fundo branco na conversão
- Metadados EXIF não são preservados
- Qualidade fixa em 80%

---

## Licença

MIT — uso livre para fins pessoais e comerciais.

---

Criado por [devgbr86](https://github.com/devgbr86) — 2026.