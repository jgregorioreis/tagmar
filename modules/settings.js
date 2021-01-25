/*Classe para configurar opções do sistema*/
export const SystemSettings = function() {

    game.settings.register("tagmar", "sheetTemplate", {
        name: "Ficha",
        hint: "Opção de imagem de fundo da ficha, padrão ou fundo do livro",
        scope: "user",
        config: true,
        default: "base",
        type: String,
        choices: {
          "base": "Sem Imagem (padrão)",
          "tagmar3": "Borda Dos Livros Tagmar 3.0",
          "tagmar3pap": "Borda Dos Livros Tagmar 3.0 + Papiros (Licinio Souza)",
          "tagmar3barda": "Borda Dos Livros Tagmar 3.0 + Barda - Meio-Elfa (Antomio Jironimo Bizerril Neto)",
          "tagmar3bardo": "Borda Dos Livros Tagmar 3.0 + Bardo - Meio-Elfo (Claudio Souza)",
          "tagmar3anao": "Borda Dos Livros Tagmar 3.0 + Guerreiro - Anão (Sergio Artigas)",
          "tagmar3gana": "Borda Dos Livros Tagmar 3.0 + Guerreira - Anã (Berbert)",
          "tagmar3ghuma": "Borda Dos Livros Tagmar 3.0 + Guerreira - Humana  (Jorge Paiva)",
          "tagmar3ghumk": "Borda Dos Livros Tagmar 3.0 + Guerreira - Humana (Jorge Kenko)",
          "tagmar3lhuma": "Borda Dos Livros Tagmar 3.0 + Ladina Humana (Licinio Souza)",
          "tagmar3lhum": "Borda Dos Livros Tagmar 3.0 + Ladino - Humano (Luiz Berbert)",
          "tagmar3lpeqa": "Borda Dos Livros Tagmar 3.0 + Ladina Pequenina (Licinio Souza)",
          "tagmar3lpeq": "Borda Dos Livros Tagmar 3.0 + Ladino - Pequenino (Antomio Jironimo Bizerril Neto)",
          "tagmar3melfa": "Borda Dos Livros Tagmar 3.0 + Maga - Elfa (Luis Berbert)",
          "tagmar3melfo": "Borda Dos Livros Tagmar 3.0 + Mago - Elfo (Antomio Jironimo Bizerril Neto)",
          "tagmar3mhuma": "Borda Dos Livros Tagmar 3.0 + Maga - Humana (Antomio Jironimo Bizerril Neto)",
          "tagmar3relf": "Borda Dos Livros Tagmar 3.0 + Rastreador Elfo (Sergio Artigas)",
          "tagmar3rhuma": "Borda Dos Livros Tagmar 3.0 + Rastreadora Humana (Sergio Artigas)",
          "tagmar3shum": "Borda Dos Livros Tagmar 3.0 + Sacerdote Humano (Luis Berbert)",
          "tagmar3shumv": "Borda Dos Livros Tagmar 3.0 + Sacerdote Humano Velho (Luis Berbert)",
          "tagmar3selfa": "Borda Dos Livros Tagmar 3.0 + Sacerdotisa Elfa Dourada (Licinio Souza)",
          "tagmar3shum1": "Borda Dos Livros Tagmar 3.0 + Sacerdotiza - Humana (Marlon Souza)",
          "tagmar3shum2": "Borda Dos Livros Tagmar 3.0 + Sacerdotiza Humana (Sergio Artigas)"
        }
      });

}