export default class tagmarAltSheet extends ActorSheet {

    static get defaultOptions() {
        this.lastUpdate = {};
        return mergeObject(super.defaultOptions, {
        classes: ["tagmar", "sheet", "actor"],
        //width: 900,
        height: 970,
        tabs: [{
            navSelector: ".prim-tabs",
            contentSelector: ".sheet-primary",
            initial: "basico"
            }]
        });
    }
    
    get template() {
        let gameSystem = game.system.id;
        let layout = game.settings.get(gameSystem, "sheetTemplate");
        if (this.actor.data.type == "Personagem" && layout != "base") {
            if (layout == 'tagmar3anao') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-anao.hbs';
            } else if (layout == 'tagmar3barda') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-barda.hbs';
            } else if (layout == 'tagmar3bardo') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-bardo.hbs';
            } else if (layout == 'tagmar3gana') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-gana.hbs';
            } else if (layout == 'tagmar3ghuma') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-ghuma.hbs';
            } else if (layout == 'tagmar3ghumk') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-ghumk.hbs';
            } else if (layout == 'tagmar3lhuma') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-lhuma.hbs';
            } else if (layout == 'tagmar3lpeqa') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-lpeqa.hbs';
            } else if (layout == 'tagmar3lpeq') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-lpeq.hbs';
            } else if (layout == 'tagmar3lhum') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-lhum.hbs';
            } else if (layout == 'tagmar3melfa') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-melfa.hbs';
            } else if (layout == 'tagmar3mhuma') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-mhuma.hbs';
            } else if (layout == 'tagmar3melfo') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-melfo.hbs';
            } else if (layout == 'tagmar3pap') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-pap.hbs';
            } else if (layout == 'tagmar3relf') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-relf.hbs';
            } else if (layout == 'tagmar3rhuma') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-rhuma.hbs';
            } else if (layout == 'tagmar3shum') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-shum.hbs';
            } else if (layout == 'tagmar3shumv') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-shumv.hbs';
            } else if (layout == 'tagmar3selfa') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-selfa.hbs';
            } else if (layout == 'tagmar3shum1') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-shum1.hbs';
            } else if (layout == 'tagmar3shum2') {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha-shum2.hbs';
            } else {
                return 'systems/tagmar/templates/sheetsPoints/personagem-ficha.hbs';
            }
            
        } else if (this.actor.data.type == "Personagem" && layout == "base") {
            return 'systems/tagmar/templates/sheetsPoints/personagem-sheet.hbs';
        } else if (this.actor.data.type == "NPC" && layout != "base") {
            return 'systems/tagmar/templates/sheets/npc-ficha.hbs';
        } else if (this.actor.data.type == "Inventario" && layout != "base") {
            return 'systems/tagmar/templates/sheets/inventario-ficha.hbs';
        } else {
            return 'systems/tagmar/templates/sheets/'+ this.actor.data.type.toLowerCase() +'-sheet.hbs';
        }
    }

    getData(options) {
        const data = super.getData(options);
        data.dtypes = ["String", "Number", "Boolean"];

        if (this.actor.data.type == 'Personagem') {
            let updatePers = {};
            this._prepareCharacterItems(data);
            const gameSystem = game.system.id;
            if (!game.settings.get(gameSystem, 'ajusteManual')) this._setPontosRaca(data, updatePers); // pontos = actor.data.data.carac_final.INT
            this._prepareValorTeste(data, updatePers);
            if (data.actor.raca) {
                this._preparaCaracRaciais(data, updatePers);
            }
            if (data.actor.profissao) {
                this._attProfissao(data, updatePers);
            }
            this._attCargaAbsorcaoDefesa(data, updatePers);
            if (data.actor.raca && data.actor.profissao) {
                this._attEfEhVB(data, updatePers); 
            }
            this._attProximoEstag(data, updatePers);
            this._attKarmaMax(data, updatePers);
            this._attRM(data, updatePers);
            this._attRF(data, updatePers);

            if (updatePers.hasOwnProperty('_id')) delete updatePers['_id'];
            if (this.lastUpdate) {
                if (this.lastUpdate.hasOwnProperty('_id')) delete this.lastUpdate['_id'];
            }
            if (Object.keys(updatePers).length > 0 && this.options.editable) {
                if (!this.lastUpdate) {
                    this.lastUpdate = updatePers;
                    this.actor.update(updatePers);
                    //ui.notifications.info("Ficha atualizada.");
                }
                else if (JSON.stringify(updatePers) !== JSON.stringify(this.lastUpdate)) {   // updatePers[Object.keys(updatePers)[0]] != this.lastUpdate[Object.keys(updatePers)[0]]
                    this.lastUpdate = updatePers;
                    this.actor.update(updatePers);
                    //ui.notifications.info("Ficha atualizada.");
                }
            }
        } else if (this.actor.data.type == "Inventario") {
            this._prepareInventarioItems(data);
        } else if (this.actor.data.type == 'NPC') {
            let updateNpc = {};
            this._prepareCharacterItems(data);
            this._prepareValorTeste(data, updateNpc);
            this._attDefesaNPC(data, updateNpc);
            if (Object.keys(updateNpc).length > 0) {
                this.actor.update(updateNpc);
            }
        }

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (this.actor.data.type != "Inventario") {
            if (!this.options.editable) return;
        }
  
        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });

        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            let dialog = new Dialog({
                title: "Tem certeza que deseja deletar?",
                content: "<p class='rola_desc mediaeval'>Deseja mesmo <b>deletar</b> esse item?</p>",
                buttons: {
                    sim: {
                        icon: "<i class='fas fa-check'></i>",
                        label: "Confirmar",
                        callback: () => {
                            this.actor.deleteEmbeddedDocuments("Item", [li.data("itemId")]);
                            li.slideUp(200, () => this.render(false));
                        }
                    },
                    nao: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancelar",
                        callback: () => {}
                    }
                },
                default: "nao"
            });
            dialog.render(true);
        });
  
        if (this.actor.data.type != "Inventario") {
        //Ativa edição de descricao
        html.find('.ativaDesc').click(this._edtDesc.bind(this));

        html.find('.item-copy').click(this._duplicateItem.bind(this));

        html.find('.rollable').click(this._onItemRoll.bind(this));

        html.find(".movePertence").click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            if (this.actor.data.data.carga_transp.hasTransp){
                if (!item.data.data.inTransport) {
                    item.update({
                        "data.inTransport": true
                    });
                } else {
                    item.update({
                        "data.inTransport": false
                    });
                }
            }
        });
        html.find(".ativaEfeito").click(this._ativaEfeito.bind(this));
        html.find(".calculaNovaEH").click(this._passandoEH.bind(this));
        html.find(".roll1d10").click(ev => {
            let formula = "1d10";
            let r = new Roll(formula);
            r.evaluate({async: false});
            r.toMessage({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: ``
            });
            $(html.find(".valord10EH")).val(r.total);
            $('.calculaNovaEH').css('color', 'rgb(94, 8, 8)');
        });
        html.find(".clickHab").mousedown( function (event) {
            $('.clickHab').html("Nível");
            $('.habNivel').removeClass('esconde');
            $('.habTotal').addClass('esconde');
        });
        html.find(".clickHab").mouseup( function (event) {
            $('.clickHab').html("Total");
            $('.habNivel').addClass('esconde');
            $('.habTotal').removeClass('esconde');
        });
        html.find(".showImg").click(this._combateImg.bind(this));
        html.find(".displayRaca").click(this._displayRaca.bind(this));
        html.find(".displayProf").click(this._displayProf.bind(this));
        html.find(".addGrupoArmas").click(this._addGrupoArmas.bind(this));
        html.find(".subGrupoArmas").click(this._subGrupoArmas.bind(this));
        html.find(".rolarMoral").click(this._rolarMoral.bind(this));
        html.find(".rolaR_Fis").click(this._rolaRFIS.bind(this));
        html.find(".rolaR_Mag").click(this._rolaRMAG.bind(this));
        html.find(".rolarAtt").click(this._rolarAtt.bind(this));
        if (this.actor.isOwner) {
        let handler = ev => this._onDragStart(ev);
        html.find('.dragable').each((i, li) => {
            if (li.classList.contains("inventory-header")) return;
            li.setAttribute("draggable", true);
            li.addEventListener("dragstart", handler, false);
        });
        }
        }
        if (this.actor.data.type == "Inventario") {
            $('.searchPertence').prop( "disabled", false );
            html.find('.searchPertence').keyup(this._realcaPertence.bind(this));
            html.find('.item-cesto').click(ev => {
                const actors = game.actors;
                let personagem;
                let inventario;
                let bau = null;
                actors.forEach(function (actor){
                    if (actor.isOwner && actor.data.type == "Personagem") personagem = actor;
                    if (actor.isOwner && actor.data.type == "Inventario") {
                        console.log(actor);
                        bau = actor;
                        inventario = actor;
                    }
                    else if (actor.data.type == "Inventario") inventario = actor;
                });
                const li = $(ev.currentTarget).parents(".item");
                const item = this.actor.items.get(li.data('itemId')); 
                personagem.createEmbeddedDocuments("Item", [item.data]); 
                if (bau == this.actor) {
                    bau.deleteEmbeddedDocuments("Item", [item.id]); 
                }
            });
        } else if (this.actor.data.type == "Personagem") {
            html.find('.searchPertence').keyup(this._realcaPertence.bind(this));
            html.find('.searchMagia').keyup(this._realcaMagia.bind(this));
            html.find('.searchCombate').keyup(this._realcaCombate.bind(this));
            html.find('.searchHabilidade').keyup(this._realcaHablidade.bind(this));
            html.find('.searchEfeito').keyup(this._realcaEfeito.bind(this));
        } 
    }

    async _rolarMoral(event) {
        const tabela_resol = this.tabela_resol;
        let moral = this.actor.data.data.moral;
        if (moral < -7) moral = -7;
        let formulaD = "1d20";
        let r = new Roll(formulaD);
        let resultado = "";
        let col_tab = [];
        let PrintResult = "";
        await r.evaluate({async: false});
        let Dresult = r.total;
        if (moral <= 20) {
            col_tab = tabela_resol.find(h => h[0] == moral);
            resultado = col_tab[Dresult];
            if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
            else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
            else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
            else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
            else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
            else if (resultado == "azul" || resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
            else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
            let coluna = "<h4 class='mediaeval rola'>Coluna:" + col_tab[0] + "</h4>";
            await r.toMessage({
                user: game.user.id,
                speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                flavor: `<h2 class='mediaeval rola'>Moral - ${moral}</h2>${coluna}${PrintResult}`
            });
        } else {
            let valor_hab = moral % 20;
            if (valor_hab == 0) {
                let vezes = moral / 20;
                for (let x = 0; x < vezes; x++){
                    let ds = await new Roll("1d20").evaluate({async: false});
                    col_tab = tabela_resol.find(h => h[0] == 20);
                    resultado = col_tab[ds.total];
                    if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
                    else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
                    else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
                    else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
                    else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
                    else if (resultado == "azul" || resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
                    else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
                    let coluna = "<h4 class='mediaeval rola'>Coluna:" + col_tab[0] + "</h4>";
                    await ds.toMessage({
                        user: game.user.id,
                        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                        flavor: `<h2 class='mediaeval rola'>Moral - ${moral}</h2>${coluna}${PrintResult}`
                    });
                }
            } else if (valor_hab > 0) {
                    let vezes = parseInt(moral / 20);
                    let sobra = moral % 20;
                    for (let x = 0; x < vezes; x++){
                        let ds = await new Roll("1d20").evaluate({async: false});
                        col_tab = tabela_resol.find(h => h[0] == 20);
                        resultado = col_tab[ds.total];
                        if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
                        else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
                        else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
                        else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
                        else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
                        else if (resultado == "azul" || resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
                        else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
                        let coluna = "<h4 class='mediaeval rola'>Coluna:" + col_tab[0] + "</h4>";
                        await ds.toMessage({
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                            flavor: `<h2 class='mediaeval rola'>Moral - ${moral}</h2>${coluna}${PrintResult}`
                        });
                    }
                    let dado = await new Roll(formulaD).evaluate({async: false});
                    col_tab = tabela_resol.find(h => h[0] == sobra);
                    resultado = col_tab[dado.total];
                    if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
                    else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
                    else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
                    else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
                    else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
                    else if (resultado == "azul" || resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
                    else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
                    let coluna = "<h4 class='mediaeval rola'>Coluna:" + col_tab[0] + "</h4>";
                    await dado.toMessage({
                        user: game.user.id,
                        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                        flavor: `<h2 class='mediaeval rola'>Moral - ${moral}</h2>${coluna}${PrintResult}`
                    });
                }
        }
        
    }

    _attDefesaNPC(data, updateNpc) {
        if (!this.options.editable) return;
        var absorcao = 0;
        var def_pasVal = 0;
        var def_pasCat = "";
        if (data.actor.defesas.length > 0){
            data.actor.defesas.forEach(function(item){
                absorcao += item.data.absorcao;
                def_pasVal += item.data.defesa_base.valor;
                if (item.data.defesa_base.tipo != ""){
                    def_pasCat = item.data.defesa_base.tipo;
                }
            });
        }
        var def_atiVal = def_pasVal + this.actor.data.data.atributos.AGI;
        const actorData = this.actor.data.data;
        if (actorData.d_passiva.valor != def_pasVal || actorData.d_passiva.categoria != def_pasCat || actorData.d_ativa.categoria != def_pasCat || actorData.d_ativa.valor != def_atiVal || actorData.absorcao.max != absorcao) {
            updateNpc["data.d_passiva.valor"] = def_pasVal;
            updateNpc["data.d_passiva.categoria"] = def_pasCat;
            updateNpc["data.d_ativa.categoria"] = def_pasCat;
            updateNpc["data.d_ativa.valor"] = def_atiVal;
            updateNpc["data.absorcao.max"] = absorcao;
        }
    }

    _prepareInventarioItems(sheetData) { 
        const actorData = sheetData.actor;
        const pertences = [];
        const transportes = [];
        const cesto = [];
        const itens = sheetData.items;
        itens.forEach(function(item, indice, array) {
            if (item.type == "Pertence") {
                pertences.push(item);
            } else if (item.type == "Transporte") {
                transportes.push(item);
            }
        });
        if (pertences.length > 1) pertences.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (transportes.length > 1) transportes.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        actorData.pertences = pertences;
        actorData.transportes = transportes;
        actorData.cesto = cesto;
        this.cesto = cesto;
    }

    _realcaEfeito(event) {
        event.preventDefault();
        const search = $(event.target).val();
        let search_down = search.toLowerCase();
        $(".efeitoName").each(function(this_td, element) {
            let efeito = $(element).html();
            efeito = efeito.toLowerCase();
            let parente = $(element).closest('tr');
            if (efeito.includes(search_down) && search_down.length > 0) {
                $(parente).removeClass('esconde');
            } else if (search_down.length > 0) {
                $(parente).addClass('esconde');
            }
            else {
                $(parente).removeClass('esconde');
            }
        });
    }

    _realcaHablidade(event) {
        event.preventDefault();
        const search = $(event.target).val();
        let search_down = search.toLowerCase();
        $(".habName").each(function(this_td, element) {
            let pertence = $(element).html();
            pertence = pertence.toLowerCase();
            let parente = $(element).closest('tr');
            if (pertence.includes(search_down) && search_down.length > 0) {
                $(parente).removeClass('esconde');
            } else if (search_down.length > 0) {
                $(parente).addClass('esconde');
            }
            else {
                $(parente).removeClass('esconde');
            }
        });
    }

    _realcaCombate(event) {
        event.preventDefault();
        const search = $(event.target).val();
        let search_down = search.toLowerCase();
        $(".combateName").each(function(this_td, element) {
            let pertence = $(element).html();
            pertence = pertence.toLowerCase();
            let parente = $(element).closest('tr');
            if (pertence.includes(search_down) && search_down.length > 0) {
                $(parente).removeClass('esconde');
            } else if (search_down.length > 0) {
                $(parente).addClass('esconde');
            }
            else {
                $(parente).removeClass('esconde');
            }
        });
    }

    _realcaMagia(event) {
        event.preventDefault();
        const search = $(event.target).val();
        let search_down = search.toLowerCase();
        $(".magiaName").each(function(this_td, element) {
            let pertence = $(element).html();
            pertence = pertence.toLowerCase();
            let parente = $(element).closest('tr');
            if (pertence.includes(search_down) && search_down.length > 0) {
                $(parente).removeClass('esconde');
            } else if (search_down.length > 0) {
                $(parente).addClass('esconde');
            }
            else {
                $(parente).removeClass('esconde');
            }
        });
    }

    _realcaPertence(event) {
        event.preventDefault();
        const search = $(event.target).val();
        let search_down = search.toLowerCase();
        $(".pertenceName").each(function(this_td, element) {
            let pertence = $(element).html();
            pertence = pertence.toLowerCase();
            let parente = $(element).closest('tr');
            if (pertence.includes(search_down) && search_down.length > 0) {
                $(parente).removeClass('esconde');
            } 
            else if (search_down.length > 0) {
                $(parente).addClass('esconde');
            }
            else {
                $(parente).removeClass('esconde');
            }
        });
    }

    async _rolarAtt(event) {      // Rolar Atributo
        const actorData = this.actor.data.data;
        const target = event.currentTarget;
        let valor_teste = 0;
        const cat = $(target).data("itemId");
        const tabela_resol = this.tabela_resol;
        let PrintResult = "";
        let habil = 0;

        if (cat == "INT") {
            habil = actorData.atributos.INT;
            valor_teste = actorData.valor_teste.INT;
        }
        else if (cat == "AUR") {
            habil = actorData.atributos.AUR;
            valor_teste = actorData.valor_teste.AUR;
        }
        else if (cat == "CAR") {
            habil = actorData.atributos.CAR;
            valor_teste = actorData.valor_teste.CAR;
        }
        else if (cat == "FOR") {
            habil = actorData.atributos.FOR;
            valor_teste = actorData.valor_teste.FOR;
        }
        else if (cat == "FIS") {
            habil = actorData.atributos.FIS;
            valor_teste = actorData.valor_teste.FIS;
        }
        else if (cat == "AGI") {
            habil = actorData.atributos.AGI;
            valor_teste = actorData.valor_teste.AGI;
        }
        else if (cat == "PER") {
            habil = actorData.atributos.PER;
            valor_teste = actorData.valor_teste.PER;
        }
        if (valor_teste < -7) valor_teste = -7;
        if (valor_teste >= -7) {
            if (valor_teste <= 20) {
                let r = await new Roll("1d20").evaluate({async: false});
                let col_tab = tabela_resol.find(h => h[0] == valor_teste);
                let resultado = col_tab[r.total];
                if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
                else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
                else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
                else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
                else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
                else if (resultado == "azul" || resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
                else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
                let coluna = "<h4 class='mediaeval rola'>Coluna:" + col_tab[0] + "</h4>";
                await r.toMessage({
                    user: game.user.id,
                    speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                    flavor: `<h2 class="mediaeval rola" style="text-align:center;">Teste de Habilidade ${cat} : ${habil}</h2>${coluna}${PrintResult}`
                });
            } else {
                let valor_hab = valor_teste % 20;
                if (valor_hab == 0) {
                    let vezes = valor_teste / 20;
                    for (let x = 0; x < vezes; x++){
                        let r = await new Roll("1d20").evaluate({async: false});
                        let col_tab = tabela_resol.find(h => h[0] == 20);
                        let resultado = col_tab[r.total];
                        if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
                        else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
                        else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
                        else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
                        else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
                        else if (resultado == "azul" || resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
                        else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
                        let coluna = "<h4 class='mediaeval rola'>Coluna:" + col_tab[0] + "</h4>";
                        await r.toMessage({
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                            flavor: `<h2 class="mediaeval rola" style="text-align:center;">Teste de Habilidade ${cat} : ${habil}</h2>${coluna}${PrintResult}`
                        });
                    }
                } else if (valor_hab > 0) {
                    let vezes = parseInt(valor_teste / 20);
                    let sobra = valor_teste % 20;
                    for (let x = 0; x < vezes; x++){
                        let r = await new Roll("1d20").evaluate({async: false});
                        let col_tab = tabela_resol.find(h => h[0] == 20);
                        let resultado = col_tab[r.total];
                        if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
                        else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
                        else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
                        else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
                        else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
                        else if (resultado == "azul" || resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
                        else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
                        let coluna = "<h4 class='mediaeval rola'>Coluna:" + col_tab[0] + "</h4>";
                        await r.toMessage({
                            user: game.user.id,
                            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                            flavor: `<h2 class="mediaeval rola" style="text-align:center;">Teste de Habilidade ${cat} : ${habil}</h2>${coluna}${PrintResult}`
                        });
                    }
                    let r = await new Roll("1d20").evaluate({async: false});
                    let col_tab = tabela_resol.find(h => h[0] == sobra);
                    let resultado = col_tab[r.total];
                    if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
                    else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
                    else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
                    else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
                    else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
                    else if (resultado == "azul" || resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
                    else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
                    let coluna = "<h4 class='mediaeval rola'>Coluna:" + col_tab[0] + "</h4>";
                    await r.toMessage({
                        user: game.user.id,
                        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
                        flavor: `<h2 class="mediaeval rola" style="text-align:center;">Teste de Habilidade ${cat} : ${habil}</h2>${coluna}${PrintResult}`
                    });
                }
            }
        }
    }

    _rolaRMAG(event) {
        const table_resFisMag = this.table_resFisMag;
        const forcAtaqueI = parseInt($(".F_Ataque").val());
        if (!forcAtaqueI) {
            ui.notifications.warn("Preencha um valor maior que zero no campo F.Ataque.");
            $('.F_Ataque').css('background-color','Orange');
            return;
        }
        const valorDefI = this.actor.data.data.rm;
        let forcAtaque = forcAtaqueI;
        let valorDef = valorDefI;
        let def_ataq = valorDef - forcAtaque;
        let stringSucesso = "";
        let valorSucess = 0;
        if (def_ataq == 0) valorSucess = 11;
        else if (def_ataq == 1) valorSucess = 10;
        else if (def_ataq == 2) valorSucess = 9;
        else if (def_ataq == 3) valorSucess = 8;
        else if (def_ataq == 4 || def_ataq == 5) valorSucess = 7;
        else if (def_ataq == 6 || def_ataq == 7) valorSucess = 6;
        else if (def_ataq == 8 || def_ataq == 9) valorSucess = 5;
        else if (def_ataq == 10 || def_ataq == 11) valorSucess = 4;
        else if (def_ataq == 12 || def_ataq == 13) valorSucess = 3;
        else if (def_ataq == 14 || def_ataq == 15) valorSucess = 2;
        else if (def_ataq >= 16) valorSucess = 1;
        else if (def_ataq == -1) valorSucess = 11;
        else if (def_ataq == -2) valorSucess = 12;
        else if (def_ataq == -3) valorSucess = 13;
        else if (def_ataq == -4 || def_ataq == -5) valorSucess = 14;
        else if (def_ataq == -6 || def_ataq == -7) valorSucess = 15;
        else if (def_ataq == -8 || def_ataq == -9) valorSucess = 16;
        else if (def_ataq == -10 || def_ataq == -11) valorSucess = 17;
        else if (def_ataq == -12 || def_ataq == -13) valorSucess = 18;
        else if (def_ataq == -14 || def_ataq == -15) valorSucess = 19;
        else if (def_ataq <= -16) valorSucess = 20;
        const r = new Roll("1d20");
        r.evaluate({async: false});
        const Dresult = r.total;
        if ((Dresult >= valorSucess || Dresult == 20) && Dresult > 1) { // Sucesso
            stringSucesso = "<h1 class='mediaeval rola' style='text-align:center; color: white;background-color:blue;'>SUCESSO</h1>";
        } else {    // Insucesso
            stringSucesso = "<h1 class='mediaeval rola' style='text-align:center; color: white;background-color:red;'>FRACASSO</h1>";
        }  
        r.toMessage({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `<h2 class="mediaeval rola">Teste de Resistência </h2><h3 class="mediaeval rola"> Força Ataque: ${forcAtaqueI}</h3><h3 class="mediaeval rola">Resistência Magía: ${valorDefI}</h3>${stringSucesso}`
        });
        $(".F_Ataque").val("");
        if (this.actor.data.data.forca_ataque) {
            this.actor.update({
                "data.forca_ataque": null
            });
        }
    }

    _rolaRFIS(event) {
        const table_resFisMag = this.table_resFisMag;
        const forcAtaqueI = parseInt($(".F_Ataque").val());
        if (!forcAtaqueI) {
            ui.notifications.warn("Preencha um valor maior que zero no campo F.Ataque.");
            $('.F_Ataque').css('background-color','Orange');
            return;
        }
        const valorDefI = this.actor.data.data.rf;
        let forcAtaque = forcAtaqueI;
        let valorDef = valorDefI;
        let def_ataq = valorDef - forcAtaque;
        let stringSucesso = "";
        let valorSucess = 0;
        if (def_ataq == 0) valorSucess = 11;
        else if (def_ataq == 1) valorSucess = 10;
        else if (def_ataq == 2) valorSucess = 9;
        else if (def_ataq == 3) valorSucess = 8;
        else if (def_ataq == 4 || def_ataq == 5) valorSucess = 7;
        else if (def_ataq == 6 || def_ataq == 7) valorSucess = 6;
        else if (def_ataq == 8 || def_ataq == 9) valorSucess = 5;
        else if (def_ataq == 10 || def_ataq == 11) valorSucess = 4;
        else if (def_ataq == 12 || def_ataq == 13) valorSucess = 3;
        else if (def_ataq == 14 || def_ataq == 15) valorSucess = 2;
        else if (def_ataq >= 16) valorSucess = 1;
        else if (def_ataq == -1) valorSucess = 11;
        else if (def_ataq == -2) valorSucess = 12;
        else if (def_ataq == -3) valorSucess = 13;
        else if (def_ataq == -4 || def_ataq == -5) valorSucess = 14;
        else if (def_ataq == -6 || def_ataq == -7) valorSucess = 15;
        else if (def_ataq == -8 || def_ataq == -9) valorSucess = 16;
        else if (def_ataq == -10 || def_ataq == -11) valorSucess = 17;
        else if (def_ataq == -12 || def_ataq == -13) valorSucess = 18;
        else if (def_ataq == -14 || def_ataq == -15) valorSucess = 19;
        else if (def_ataq <= -16) valorSucess = 20;
        const r = new Roll("1d20");
        r.evaluate({async: false});
        const Dresult = r.total;
        if ((Dresult >= valorSucess || Dresult == 20) && Dresult > 1) { // Sucesso
            stringSucesso = "<h1 class='mediaeval rola' style='text-align:center; color: white;background-color:blue;'>SUCESSO</h1>";
        } else {    // Insucesso
            stringSucesso = "<h1 class='mediaeval rola' style='text-align:center; color: white;background-color:red;'>FRACASSO</h1>";
        }  
        r.toMessage({
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: `<h2 class="mediaeval rola">Teste de Resistência </h2><h3 class="mediaeval rola"> Força Ataque: ${forcAtaqueI}</h3><h3 class="mediaeval rola">Resistência Física: ${valorDefI}</h3>${stringSucesso}`
        });
        $(".F_Ataque").val("");
        if (this.actor.data.data.forca_ataque) {
            this.actor.update({
                "data.forca_ataque": null
            });
        }
    }

    _addGrupoArmas(event) {
        const grupo = $(event.currentTarget).data("itemId");
        const actorData = this.actor.data;
        if (actorData.data.pontos_comb >= 0) {
            if (grupo == "CD") {
                let pontos = actorData.data.grupos.CD + 1;
                this.actor.update({
                    "data.grupos.CD": pontos
                });
            } else if (grupo == "CI") {
                let pontos = actorData.data.grupos.CI + 1;
                this.actor.update({
                    "data.grupos.CI": pontos
                });
            } else if (grupo == "CL") {
                let pontos = actorData.data.grupos.CL + 1;
                this.actor.update({
                    "data.grupos.CL": pontos
                });
            } else if (grupo == "CLD") {
                let pontos = actorData.data.grupos.CLD + 1;
                this.actor.update({
                    "data.grupos.CLD": pontos
                });
            } else if (grupo == "EL") {
                let pontos = actorData.data.grupos.EL + 1;
                this.actor.update({
                    "data.grupos.EL": pontos
                });
            } else if (grupo == "CmE") {
                let pontos = actorData.data.grupos.CmE + 1;
                this.actor.update({
                    "data.grupos.CmE": pontos
                });
            } else if (grupo == "CmM") {
                let pontos = actorData.data.grupos.CmM + 1;
                this.actor.update({
                    "data.grupos.CmM": pontos
                });
            } else if (grupo == "EM") {
                let pontos = actorData.data.grupos.EM + 1;
                this.actor.update({
                    "data.grupos.EM": pontos
                });
            } else if (grupo == "PmA") {
                let pontos = actorData.data.grupos.PmA + 1;
                this.actor.update({
                    "data.grupos.PmA": pontos
                });
            } else if (grupo == "PmL") {
                let pontos = actorData.data.grupos.PmL + 1;
                this.actor.update({
                    "data.grupos.PmL": pontos
                });
            } else if (grupo == "CpE") {
                let pontos = actorData.data.grupos.CpE + 1;
                this.actor.update({
                    "data.grupos.CpE": pontos
                });
            } else if (grupo == "CpM") {
                let pontos = actorData.data.grupos.CpM + 1;
                this.actor.update({
                    "data.grupos.CpM": pontos
                });
            } else if (grupo == "EP") {
                let pontos = actorData.data.grupos.EP + 1;
                this.actor.update({
                    "data.grupos.EP": pontos
                });
            } else if (grupo == "PP") {
                let pontos = actorData.data.grupos.PP + 1;
                this.actor.update({
                    "data.grupos.PP": pontos
                });
            } else if (grupo == "PpA") {
                let pontos = actorData.data.grupos.PpA + 1;
                this.actor.update({
                    "data.grupos.PpA": pontos
                });
            } else if (grupo == "PpB") {
                let pontos = actorData.data.grupos.PpB + 1;
                this.actor.update({
                    "data.grupos.PpB": pontos
                });
            }
        }
    }
    _subGrupoArmas(event){
        const grupo = $(event.currentTarget).data("itemId");
        const actorData = this.actor.data;
        if (grupo == "CD" && actorData.data.grupos.CD > 0) {
            let pontos = actorData.data.grupos.CD - 1;
            this.actor.update({
                "data.grupos.CD": pontos
            });
        } else if (grupo == "CI" && actorData.data.grupos.CI > 0) {
            let pontos = actorData.data.grupos.CI - 1;
            this.actor.update({
                "data.grupos.CI": pontos
            });
        } else if (grupo == "CL" && actorData.data.grupos.CL > 0) {
            let pontos = actorData.data.grupos.CL - 1;
            this.actor.update({
                "data.grupos.CL": pontos
            });
        } else if (grupo == "CLD" && actorData.data.grupos.CLD > 0) {
            let pontos = actorData.data.grupos.CLD - 1;
            this.actor.update({
                "data.grupos.CLD": pontos
            });
        } else if (grupo == "EL" && actorData.data.grupos.EL > 0) {
            let pontos = actorData.data.grupos.EL - 1;
            this.actor.update({
                "data.grupos.EL": pontos
            });
        } else if (grupo == "CmE" && actorData.data.grupos.CmE > 0) {
            let pontos = actorData.data.grupos.CmE - 1;
            this.actor.update({
                "data.grupos.CmE": pontos
            });
        } else if (grupo == "CmM" && actorData.data.grupos.CmM > 0) {
            let pontos = actorData.data.grupos.CmM - 1;
            this.actor.update({
                "data.grupos.CmM": pontos
            });
        } else if (grupo == "EM" && actorData.data.grupos.EM > 0) {
            let pontos = actorData.data.grupos.EM - 1;
            this.actor.update({
                "data.grupos.EM": pontos
            });
        } else if (grupo == "PmA" && actorData.data.grupos.PmA > 0) {
            let pontos = actorData.data.grupos.PmA - 1;
            this.actor.update({
                "data.grupos.PmA": pontos
            });
        } else if (grupo == "PmL" && actorData.data.grupos.PmL > 0) {
            let pontos = actorData.data.grupos.PmL - 1;
            this.actor.update({
                "data.grupos.PmL": pontos
            });
        } else if (grupo == "CpE" && actorData.data.grupos.CpE > 0) {
            let pontos = actorData.data.grupos.CpE - 1;
            this.actor.update({
                "data.grupos.CpE": pontos
            });
        } else if (grupo == "CpM" && actorData.data.grupos.CpM > 0) {
            let pontos = actorData.data.grupos.CpM - 1;
            this.actor.update({
                "data.grupos.CpM": pontos
            });
        } else if (grupo == "EP" && actorData.data.grupos.EP > 0) {
            let pontos = actorData.data.grupos.EP - 1;
            this.actor.update({
                "data.grupos.EP": pontos
            });
        } else if (grupo == "PP" && actorData.data.grupos.PP > 0) {
            let pontos = actorData.data.grupos.PP - 1;
            this.actor.update({
                "data.grupos.PP": pontos
            });
        } else if (grupo == "PpA" && actorData.data.grupos.PpA > 0) {
            let pontos = actorData.data.grupos.PpA - 1;
            this.actor.update({
                "data.grupos.PpA": pontos
            });
        } else if (grupo == "PpB" && actorData.data.grupos.PpB > 0) {
            let pontos = actorData.data.grupos.PpB - 1;
            this.actor.update({
                "data.grupos.PpB": pontos
            });
        }
        
    }

    _displayRaca(event) {
        const racaData = this.raca;
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({
                actor: this.actor
              })
        };
        chatData.content = "<img src='"+ racaData.img +"' style='display: block; margin-left: auto; margin-right: auto;' /><h1 class='mediaeval rola' style='text-align: center;'>" + racaData.name + "</h1>"  + "<h3 class='mediaeval rola rola_desc'>" + racaData.data.descricao + "</h3>";
        ChatMessage.create(chatData);
    }

    _displayProf(event) {
        const profData = this.profissao;
        let chatData = {
            user: game.user.id,
            speaker: ChatMessage.getSpeaker({
                actor: this.actor
              })
        };
        chatData.content = "<img src='"+ profData.img +"' style='display: block; margin-left: auto; margin-right: auto;' /><h1 class='mediaeval rola' style='text-align: center;'>" + profData.name + "</h1>"  + "<h3 class='mediaeval rola rola_desc'>" + profData.data.descricao + "</h3>";
        ChatMessage.create(chatData);
    }

    _combateImg(event) {
        const actorData = this.actor.data.data;
        const grupo = $(event.currentTarget).data("itemId");
        let combos = actorData.combos;
        let com_list = combos.split(',');
        const found = com_list.find(element => element == grupo);
        if (found) {
            com_list.splice(com_list.indexOf(grupo),1);
            this.actor.update({
                "data.combos": com_list.join(',')
            });
        } else {
            com_list.push(grupo);
            this.actor.update({
                "data.combos": com_list.join(',')
            });
        }
    }

    _passandoEH(event) {
        let estagio_atual = this.actor.data.data.estagio;
        let valord10 = parseInt($(".valord10EH").val());
        if (!valord10 && estagio_atual > 1) {
            ui.notifications.warn("Clique em '1d10' para rolar o dado ou preencha o valor no campo.");
            $('.roll1d10').css('color', 'rgb(94, 8, 8)');
            return;
        }
        let raca_list = [];
        let nova_eh = 0;
        let eh_atual = this.actor.data.data.eh.max;
        let attFIS = this.actor.data.data.atributos.FIS;
        if (estagio_atual > 1 && valord10 > 0 && valord10 <= 10) {
            if (this.profissao) {
                if (valord10 >= 1 && valord10 <= 2) {
                    nova_eh = this.profissao.data.lista_eh.v1;
                    this.actor.update({
                        "data.eh.max": eh_atual + nova_eh + attFIS
                    });
                    ui.notifications.info("Nova EH calculada.");
                } else if (valord10 >= 3 && valord10 <= 5) {
                    nova_eh = this.profissao.data.lista_eh.v2;
                    this.actor.update({
                        "data.eh.max": eh_atual + nova_eh + attFIS
                    });
                    ui.notifications.info("Nova EH calculada.");
                } else if (valord10 >= 6 && valord10 <= 8) {
                    nova_eh = this.profissao.data.lista_eh.v3;
                    this.actor.update({
                        "data.eh.max": eh_atual + nova_eh + attFIS
                    });
                    ui.notifications.info("Nova EH calculada.");
                } else if (valord10 >= 9 && valord10 <= 10) {
                    nova_eh = this.profissao.data.lista_eh.v4;
                    this.actor.update({
                        "data.eh.max": eh_atual + nova_eh + attFIS
                    });
                    ui.notifications.info("Nova EH calculada.");
                }
            }
        }
        if (this.actor.data.data.valor_dado_eh) {
            this.actor.update({
                "data.valor_dado_eh": null
            });
        }
        //$(".valord10EH").val("");
        //this.render();
    }

    _ativaEfeito(event) {
        event.preventDefault();
        let button = $(event.currentTarget);
        const li = button.parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let ativo = item.data.data.ativo;
        let ativa;
        if (ativo) {
            ativa = false;
        } else {
            ativa = true;
        }
        item.update({
            "data.ativo": ativa
        });
    }

    _onItemRoll (event) {
        let button = $(event.currentTarget);
        const li = button.parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        item.rollTagmarItem();
    }

    _duplicateItem(event) {
        const li = $(event.currentTarget).parents(".item");
        const item = this.actor.items.get(li.data("itemId"));
        let dupi = duplicate(item);
        dupi.name = dupi.name + "(Cópia)";
        this.actor.createEmbeddedDocuments("Item", [dupi]);
    }

    _edtDesc(event) {
        const actorData = this.actor.data.data;
            if (actorData.v_base == 0) {
                this.actor.update({
                    'data.v_base': 1
                });
            } else {
                this.actor.update({
                    'data.v_base': 0
                });
            }
    }

    _attRM(data, updatePers) {
        if (!this.options.editable) return;
        let rm = this.actor.data.data.estagio + this.actor.data.data.atributos.AUR;
        if (this.efeitos.length > 0) {
            for (let efeito of this.efeitos) {
                if (efeito.data.atributo == "RMAG" && efeito.data.ativo) {
                    if (efeito.data.tipo == "+") {
                        rm += efeito.data.valor;
                    } else if (efeito.data.tipo == "-") {
                        rm -= efeito.data.valor;
                    } else if (efeito.data.tipo == "*") {
                        rm = rm * efeito.data.valor;
                    } else if (efeito.data.tipo == "/") {
                        rm = rm / efeito.data.valor;
                    }
                }
            }
        }
        if (this.actor.data.data.rm != rm) {
            updatePers["data.rm"] = rm;
        }
    }

    _attRF(data, updatePers) {
        if (!this.options.editable) return;
        let rf = this.actor.data.data.estagio + this.actor.data.data.atributos.FIS;
        if (this.efeitos.length > 0) {
            for (let efeito of this.efeitos){
                if (efeito.data.atributo == "RFIS" && efeito.data.ativo){
                    if (efeito.data.tipo == "+") {
                        rf += efeito.data.valor;
                    } else if (efeito.data.tipo == "-") {
                        rf -= efeito.data.valor;
                    } else if (efeito.data.tipo == "/") {
                        rf = rf / efeito.data.valor;
                    } else if (efeito.data.tipo == "*") {
                        rf = rf * efeito.data.valor;
                    }
                }
            }
        }
        if (this.actor.data.data.rf != rf) {
            updatePers["data.rf"] = rf;
        } 
    }

    _attKarmaMax(data, updatePers) {
        if (!this.options.editable) return;
        let karma = ((this.actor.data.data.atributos.AUR) + 1 ) * ((this.actor.data.data.estagio) + 1);
        if (karma < 0) karma = 0;
        if (this.efeitos.length > 0){
            for (let efeito of this.efeitos) {
                if (efeito.data.atributo == "KMA" && efeito.data.ativo) {
                    if (efeito.data.tipo == "+") {
                        karma += efeito.data.valor;
                    } else if (efeito.data.tipo == "-") {
                        karma -= efeito.data.valor;
                    } else if (efeito.data.tipo == "*") {
                        karma = karma * efeito.data.valor;
                    } else if (efeito.data.tipo == "/") {
                        karma = karma / efeito.data.valor;
                    }
                }
            }
        }
        if (this.actor.data.data.karma.max != karma) {
            updatePers["data.karma.max"] = karma;
        }
    }

    _attProximoEstag(data, updatePers) {
        if (!this.options.editable) return;
        let estagio_atual = this.actor.data.data.estagio;
        let prox_est = [0, 11, 21, 31, 46, 61, 76, 96, 116, 136, 166, 196, 226 , 266, 306, 346, 386, 436, 486, 536, 586, 646, 706, 766, 826, 896, 966, 1036, 1106, 1186, 1266, 
            1346, 1426, 1516, 1606, 1696, 1786, 1886, 1986, 2086];
        if (estagio_atual < 40 && this.actor.data.data.pontos_estagio.next != prox_est[estagio_atual]) {
            updatePers["data.pontos_estagio.next"] = prox_est[estagio_atual];
        }
    }

    _attEfEhVB(data, updatePers) {
        if (!this.options.editable) return;
        let ef_base = 0;
        let vb_base = 0;
        let eh_base = 0;
    
        ef_base = data.actor.raca.data.ef_base;
        vb_base = data.actor.raca.data.vb;
        eh_base = data.actor.profissao.data.eh_base;
        
        let efMax = this.actor.data.data.atributos.FOR + this.actor.data.data.atributos.FIS + ef_base;
        let vbTotal = this.actor.data.data.atributos.FIS + vb_base;
        if (this.efeitos.length > 0) {
            for (let efeito of this.efeitos) {
                if (efeito.data.atributo == "VB" && efeito.data.ativo) {
                    if (efeito.data.tipo == "+") {
                        vbTotal += efeito.data.valor;
                    } else if (efeito.data.tipo == "-") {
                        vbTotal -= efeito.data.valor;
                    } else if (efeito.data.tipo == "*") {
                        vbTotal = vbTotal * efeito.data.valor;
                    } else if (efeito.data.tipo == "/") {
                        vbTotal = vbTotal / efeito.data.valor;
                    }
                } else if (efeito.data.atributo == "EF" && efeito.data.ativo) {
                    if (efeito.data.tipo == "+") {
                        efMax += efeito.data.valor;
                    } else if (efeito.data.tipo == "-") {
                        efMax -= efeito.data.valor;
                    } else if (efeito.data.tipo == "*") {
                        efMax = efMax * efeito.data.valor;
                    } else if (efeito.data.tipo == "/") {
                        efMax = efMax / efeito.data.valor;
                    }
                }
            }
        }
        if (this.actor.data.data.ef.max != efMax || this.actor.data.data.vb != vbTotal) {
            updatePers["data.ef.max"] = efMax;
            updatePers["data.vb"] = vbTotal
        }
        if (this.actor.data.data.estagio == 1){
            let ehMax = eh_base + this.actor.data.data.atributos.FIS;
            if (this.actor.data.data.eh.max != ehMax) {
                updatePers["data.eh.max"] = ehMax;
            }
        }
    }

    _attCargaAbsorcaoDefesa(data, updatePers) {
        if (!this.options.editable) return;
        const actorSheet = data.actor;
        var actor_carga = 0;    // Atualiza Carga e verifica Sobrecarga
        var cap_transp = 0;
        var cap_usada = 0;
        var absorcao = 0;
        var def_pasVal = 0;
        var def_pasCat = "";
        
        if (actorSheet.defesas.length > 0){
            actorSheet.defesas.forEach(function(item){
                //actor_carga += item.data.peso;
                absorcao += item.data.absorcao;
                def_pasVal += item.data.defesa_base.valor;
                if (item.data.defesa_base.tipo != ""){
                    def_pasCat = item.data.defesa_base.tipo;
                }
            });
        }
        if (actorSheet.pertences.length > 0){
            actorSheet.pertences.forEach(function(item){
                actor_carga += item.data.peso * item.data.quant;
            });
        }
        if (actorSheet.transportes.length > 0){
            actorSheet.transportes.forEach(function(item){
                cap_transp += item.data.capacidade.carga;
            });
        }
        if (actorSheet.pertences_transporte.length > 0){
            actorSheet.pertences_transporte.forEach(function(item){
                cap_usada += item.data.peso * item.data.quant;
            });
        }
        
        var def_atiVal = def_pasVal + this.actor.data.data.atributos.AGI;
        if (this.efeitos.length > 0) {
            let apl = this.efeitos.filter(e => (e.data.atributo == "DEF" || e.data.atributo == "ABS") && e.data.ativo);
            for (let efeito of apl) {
                if (efeito.data.atributo == "DEF") {
                    if (efeito.data.tipo == "+") {
                        def_pasVal += efeito.data.valor;
                        def_atiVal += efeito.data.valor;
                    } else if (efeito.data.tipo == "-") {
                        def_pasVal -= efeito.data.valor;
                        def_atiVal -= efeito.data.valor;
                    } else if (efeito.data.tipo == "*") {
                        def_pasVal = def_pasVal * efeito.data.valor;
                        def_atiVal = def_atiVal * efeito.data.valor;
                    } else if (efeito.data.tipo == "/") {
                        def_pasVal = def_pasVal / efeito.data.valor;
                        def_atiVal = def_atiVal / efeito.data.valor;
                    }
                } else if (efeito.data.atributo == "ABS") {
                    if (efeito.data.tipo == "+") {
                        absorcao += efeito.data.valor;
                    } else if (efeito.data.tipo == "-") {
                        absorcao -= efeito.data.valor;
                    } else if (efeito.data.tipo == "*") {
                        absorcao = absorcao * efeito.data.valor;
                    } else if (efeito.data.tipo == "/") {
                        absorcao = absorcao / efeito.data.valor;
                    }
                }
            }
        }
        const actorData = this.actor.data.data;
        const actorSheetData = actorSheet.data;
        if (actorData.d_passiva.valor != def_pasVal || actorData.d_passiva.categoria != def_pasCat || actorData.d_ativa.categoria != def_pasCat || actorData.d_ativa.valor != def_atiVal || actorData.carga_transp.value != cap_usada || actorData.carga_transp.max != cap_transp || actorData.carga.value != actor_carga || actorData.absorcao.max != absorcao) {
            updatePers["data.d_passiva.valor"] = def_pasVal;
            updatePers["data.d_passiva.categoria"] = def_pasCat;
            updatePers["data.d_ativa.categoria"] = def_pasCat;
            updatePers["data.d_ativa.valor"] = def_atiVal;
            updatePers["data.carga_transp.value"] = cap_usada;
            updatePers["data.carga_transp.max"] = cap_transp;
            updatePers["data.carga.value"] = actor_carga;
            updatePers["data.absorcao.max"] = absorcao;
        }
        if (cap_transp > 0 && cap_usada < cap_transp) {
            if (!actorData.carga_transp.hasTransp) {
                updatePers["data.carga_transp.hasTransp"] = true;
            }
        } else {
            if (actorData.carga_transp.hasTransp) {
                updatePers["data.carga_transp.hasTransp"] = false;
            }
        }
        let carga_max = 0;
        if (actorSheetData.data.atributos.FOR >= 1) {
            carga_max = (actorSheetData.data.atributos.FOR * 20) + 20;
            if (actorSheetData.data.carga.value > carga_max) {
                if (!actorData.carga.sobrecarga || actorData.carga.valor_s != actorSheetData.data.carga.value - carga_max) {
                    updatePers["data.carga.sobrecarga"] = true;
                    updatePers["data.carga.valor_s"] = actorSheetData.data.carga.value - carga_max;
                }
            } else {
                if (actorData.carga.sobrecarga || actorData.carga.valor_s != 0) {
                    updatePers["data.carga.sobrecarga"] = false;
                    updatePers["data.carga.valor_s"] = 0;
                }
            }
        } else {
            carga_max = 20;
            if (actorSheetData.data.carga.value > carga_max) {
                if (!actorData.carga.sobrecarga || actorData.carga.valor_s != actorSheetData.data.carga.value - carga_max) {
                    updatePers["data.carga.sobrecarga"] = true;
                    updatePers["data.carga.valor_s"] = actorSheetData.data.carga.value - carga_max;
                }
            } else {
                if (actorData.carga.sobrecarga || actorData.carga.valor_s != 0) {
                    updatePers["data.carga.sobrecarga"] = false;
                    updatePers["data.carga.valor_s"] = 0;
                }
            }
        }
    }

    _attProfissao(sheetData, updatePers) {
        if (!this.options.editable) return;
        const actorData = sheetData.actor;
        const actorSheetData = sheetData.actor.data;
        if (actorData.profissao) {
            const profissaoData = actorData.profissao;
            const max_hab = profissaoData.data.p_aquisicao.p_hab + Math.floor(actorSheetData.data.estagio / 2);
            const atrib_magia = profissaoData.data.atrib_mag;
            let pontos_hab = profissaoData.data.p_aquisicao.p_hab * actorSheetData.data.estagio;
            const grupo_pen = profissaoData.data.grupo_pen;
            const hab_nata = actorSheetData.data.hab_nata;
            let pontos_tec = profissaoData.data.p_aquisicao.p_tec * actorSheetData.data.estagio;
            let pontos_mag = 0;
            let pontos_gra = profissaoData.data.p_aquisicao.p_gra * actorSheetData.data.estagio;
            if (max_hab != actorSheetData.data.max_hab) {
                updatePers["data.max_hab"] = max_hab;
            }
            if (atrib_magia != "") {
                if (atrib_magia == "INT") pontos_mag = ((2 * actorSheetData.data.atributos.INT) + 7) * actorSheetData.data.estagio;
                else if (atrib_magia == "AUR") pontos_mag = ((2 * actorSheetData.data.atributos.AUR) + 7) * actorSheetData.data.estagio;
                else if (atrib_magia == "CAR") pontos_mag = ((2 * actorSheetData.data.atributos.CAR) + 7) * actorSheetData.data.estagio;
                else if (atrib_magia == "FOR") pontos_mag = ((2 * actorSheetData.data.atributos.FOR) + 7) * actorSheetData.data.estagio;
                else if (atrib_magia == "FIS") pontos_mag = ((2 * actorSheetData.data.atributos.FIS) + 7)  * actorSheetData.data.estagio;
                else if (atrib_magia == "AGI") pontos_mag = ((2 * actorSheetData.data.atributos.AGI) + 7) * actorSheetData.data.estagio;
                else if (atrib_magia == "PER") pontos_mag = ((2 * actorSheetData.data.atributos.PER) + 7) * actorSheetData.data.estagio;
            } else pontos_mag = 0;
            if (this.efeitos.length > 0){
                let apl = this.efeitos.filter(e => (e.data.atributo == "PHAB" || e.data.atributo == "PTEC" || e.data.atributo == "PARM" || e.data.atributo == "PMAG") && e.data.ativo);
                for (let efeito of apl) {
                    if (efeito.data.atributo == "PHAB") {
                        if (efeito.data.tipo == "+") {
                            pontos_hab += efeito.data.valor;
                        } else if (efeito.data.tipo == "-") {
                            pontos_hab -= efeito.data.valor;
                        } else if (efeito.data.tipo == "*") {
                            pontos_hab = pontos_hab * efeito.data.valor;
                        } else if (efeito.data.tipo == "/") {
                            pontos_hab = pontos_hab / efeito.data.valor;
                        }
                    } else if (efeito.data.atributo == "PTEC") {
                        if (efeito.data.tipo == "+") {
                            pontos_tec += efeito.data.valor;
                        } else if (efeito.data.tipo == "-") {
                            pontos_tec -= efeito.data.valor;
                        } else if (efeito.data.tipo == "*") {
                            pontos_tec = pontos_tec * efeito.data.valor;
                        } else if (efeito.data.tipo == "/") {
                            pontos_tec = pontos_tec / efeito.data.valor;
                        }
                    } else if (efeito.data.atributo == "PARM") {
                        if (efeito.data.tipo == "+") {
                            pontos_gra += efeito.data.valor;
                        } else if (efeito.data.tipo == "-") {
                            pontos_gra -= efeito.data.valor;
                        } else if (efeito.data.tipo == "*") {
                            pontos_gra = pontos_gra * efeito.data.valor;
                        } else if (efeito.data.tipo == "/") {
                            pontos_gra = pontos_gra / efeito.data.valor;
                        }
                    } else if (efeito.data.atributo == "PMAG") {
                        if (efeito.data.tipo == "+") {
                            pontos_mag += efeito.data.valor;
                        } else if (efeito.data.tipo == "-") {
                            pontos_mag -= efeito.data.valor;
                        } else if (efeito.data.tipo == "*") {
                            pontos_mag = pontos_mag * efeito.data.valor;
                        } else if (efeito.data.tipo == "/") {
                            pontos_mag = pontos_mag / efeito.data.valor;
                        }
                    }
                }
            }
            if (pontos_gra > 0) {
                pontos_gra -= actorSheetData.data.grupos.CD;
                pontos_gra -= actorSheetData.data.grupos.CI;
                pontos_gra -= actorSheetData.data.grupos.CL;
                pontos_gra -= actorSheetData.data.grupos.CLD;
                pontos_gra -= actorSheetData.data.grupos.EL;
                pontos_gra -= actorSheetData.data.grupos.CmE * 2;
                pontos_gra -= actorSheetData.data.grupos.CmM * 2;
                pontos_gra -= actorSheetData.data.grupos.EM * 2;
                pontos_gra -= actorSheetData.data.grupos.PmA * 2;
                pontos_gra -= actorSheetData.data.grupos.PmL * 2;
                pontos_gra -= actorSheetData.data.grupos.CpE * 3;
                pontos_gra -= actorSheetData.data.grupos.CpM * 3;
                pontos_gra -= actorSheetData.data.grupos.EP * 3;
                pontos_gra -= actorSheetData.data.grupos.PP * 3;
                pontos_gra -= actorSheetData.data.grupos.PpA * 3;
                pontos_gra -= actorSheetData.data.grupos.PpB * 3;

            }
            for (let i = 0; i < actorData.tecnicas.length; i++) {
                pontos_tec -= actorData.tecnicas[i].data.custo * actorData.tecnicas[i].data.nivel;
            }
            for (let i = 0; i < actorData.magias.length; i++) {
                pontos_mag -= actorData.magias[i].data.custo * actorData.magias[i].data.nivel;
            }
            for (let i = 0; i < actorData.h_prof.length; i++) {
                if (grupo_pen == "profissional") {
                    pontos_hab -= (actorData.h_prof[i].data.custo + 1) * actorData.h_prof[i].data.nivel;
                } else if (hab_nata == actorData.h_prof[i].name) {
                    //pontos_hab -= 0;
                    const habilidade = this.actor.items.get(actorData.h_prof[i]._id);
                    habilidade.update({
                        "data.nivel": actorSheetData.data.estagio
                    });
                } else {
                    pontos_hab -= actorData.h_prof[i].data.custo * actorData.h_prof[i].data.nivel;
                }
            }
            for (let i = 0; i < actorData.h_man.length; i++) {
                if (grupo_pen == "manobra") {
                    pontos_hab -= (actorData.h_man[i].data.custo + 1) * actorData.h_man[i].data.nivel;
                } else if (hab_nata == actorData.h_man[i].name) {
                    const habilidade =  this.actor.items.get(actorData.h_man[i]._id);
                    habilidade.update({
                        "data.nivel": actorSheetData.data.estagio
                    });
                } else {
                    pontos_hab -= actorData.h_man[i].data.custo * actorData.h_man[i].data.nivel;
                }
            }
            for (let i = 0; i < actorData.h_con.length; i++) {
                if (grupo_pen == "conhecimento") {
                    pontos_hab -= (actorData.h_con[i].data.custo + 1) * actorData.h_con[i].data.nivel;
                } else if (hab_nata == actorData.h_con[i].name) {
                    const habilidade = this.actor.items.get(actorData.h_con[i]._id);
                    habilidade.update({
                        "data.nivel": actorSheetData.data.estagio
                    });
                } else {
                    pontos_hab -= actorData.h_con[i].data.custo * actorData.h_con[i].data.nivel;
                }
            }
            for (let i = 0; i < actorData.h_sub.length; i++) {
                if (grupo_pen == "subterfugio") {
                    pontos_hab -= (actorData.h_sub[i].data.custo + 1) * actorData.h_sub[i].data.nivel;
                } else if (hab_nata == actorData.h_sub[i].name) {
                    const habilidade =  this.actor.items.get(actorData.h_sub[i]._id);
                    habilidade.update({
                        "data.nivel": actorSheetData.data.estagio
                    });
                } else {
                    pontos_hab -= actorData.h_sub[i].data.custo * actorData.h_sub[i].data.nivel;
                }
            }
            for (let i = 0; i < actorData.h_inf.length; i++) {
                if (grupo_pen == "influencia") {
                    pontos_hab -= (actorData.h_inf[i].data.custo + 1) * actorData.h_inf[i].data.nivel;
                } else if (hab_nata == actorData.h_inf[i].name) {
                    const habilidade =  this.actor.items.get(actorData.h_inf[i]._id);
                    habilidade.update({
                        "data.nivel": actorSheetData.data.estagio
                    });
                } else {
                    pontos_hab -= actorData.h_inf[i].data.custo * actorData.h_inf[i].data.nivel;
                }
            }
            for (let i = 0; i < actorData.h_geral.length; i++) {
                if (grupo_pen == "geral") {
                    pontos_hab -= (actorData.h_geral[i].data.custo + 1) * actorData.h_geral[i].data.nivel;
                } else if (hab_nata == actorData.h_geral[i].name) {
                    const habilidade = this.actor.items.get(actorData.h_geral[i]._id);
                    habilidade.update({
                        "data.nivel": actorSheetData.data.estagio
                    });
                } else {
                    pontos_hab -= actorData.h_geral[i].data.custo * actorData.h_geral[i].data.nivel;
                }
            }
            if (pontos_hab != actorSheetData.data.pontos_aqui) {
                updatePers["data.pontos_aqui"] = pontos_hab;
            }
            if (pontos_tec != actorSheetData.data.pontos_tec) {
                updatePers["data.pontos_tec"] = pontos_tec;
            }
            if (pontos_gra != actorSheetData.data.pontos_comb) {
                updatePers["data.pontos_comb"] = pontos_gra;
            }
            if (pontos_mag != actorSheetData.data.pontos_mag) {
                updatePers["data.pontos_mag"] = pontos_mag;
            }
            if  (profissaoData.name != actorSheetData.data.profissao) {
                updatePers["data.profissao"] = profissaoData.name;
            }
        }
    }

    _prepareCharacterItems(sheetData) {
        const actorData = sheetData.actor;
        const combate = [];
        const magias = [];
        const h_prof = [];
        const h_man = [];
        const h_con = [];
        const h_sub = [];
        const h_inf = [];
        const h_geral = [];
        const tecnicas = [];
        const defesas = [];
        const transportes = [];
        const pertences = [];
        const pertences_transporte = [];
        const racas = [];
        const profissoes = [];
        var especializacoes = [];
        const itens = sheetData.items;
        const efeitos = [];
        itens.forEach(function(item, indice, array) {
            if (item.type == "Combate"){
                combate.push(item);
            } else if (item.type == "Magia") {
                magias.push(item);
            } else if (item.type == "Habilidade") {
                if (item.data.tipo == "profissional") h_prof.push(item);
                else if (item.data.tipo == "manobra") h_man.push(item);
                else if (item.data.tipo == "conhecimento") h_con.push(item);
                else if (item.data.tipo == "subterfugio") h_sub.push(item);
                else if (item.data.tipo == "influencia") h_inf.push(item);
                else if (item.data.tipo == "geral") h_geral.push(item);
            } else if (item.type == "TecnicasCombate") { 
                tecnicas.push(item);
            } else if (item.type == "Defesa") {
                defesas.push(item);
            } else if (item.type == "Transporte") {
                transportes.push(item);
            } else if (item.type == "Pertence") {
                if (item.data.inTransport) pertences_transporte.push(item);
                else pertences.push(item);
            } else if (item.type == "Raca") {
                if (racas.length >= 1) this.actor.deleteEmbeddedDocuments("Item", [item._id]);
                else racas.push(item);
                
            } else if (item.type == "Profissao") {
                if (profissoes.length >= 1) this.actor.deleteEmbeddedDocuments("Item", [item._id]);
                else profissoes.push(item);
            } else if (item.type == "Efeito") {
                efeitos.push(item);
            }
        });
        const tabela_resol = [
            [-7, "verde", "verde", "verde", "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "laranja", "vermelho", "azul", "cinza"],
            [-6, "verde", "verde", "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "laranja", "vermelho", "azul", "cinza"],
            [-5, "verde", "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "vermelho", "azul", "cinza"],
            [-4, "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "vermelho", "azul", "cinza"],
            [-3, "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "azul", "cinza"],
            [-2, "verde", "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "vermelho", "vermelho", "azul", "cinza"],
            [-1, "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "azul", "cinza"],
            [0, "verde", "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "cinza"],
            [1, "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "cinza"],
            [2, "verde", "branco", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "azul", "azul", "cinza"],
            [3, "verde", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "cinza"],
            [4, "verde", "branco", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "cinza"],
            [5, "verde", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "cinza"],
            [6, "verde", "branco", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "cinza"],
            [7, "verde", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "cinza"],
            [8, "verde", "branco", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "cinza"],
            [9, "verde", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "cinza"],
            [10, "verde", "branco", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "azul", "cinza"],
            [11, "verde", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "cinza"],
            [12, "verde", "branco", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "cinza"],
            [13, "verde", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "cinza"],
            [14, "verde", "branco", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "azul", "roxo", "cinza"],
            [15, "verde", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "roxo", "cinza"],
            [16, "verde", "amarelo", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "roxo", "cinza"],
            [17, "verde", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "roxo", "cinza"],
            [18, "verde", "amarelo", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "azul", "roxo", "roxo", "cinza"],
            [19, "verde", "amarelo", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "roxo", "roxo", "roxo", "cinza"],
            [20, "verde", "amarelo", "laranja", "laranja", "laranja", "laranja", "laranja", "laranja", "laranja", "vermelho", "vermelho", "vermelho", "azul", "azul", "azul", "azul", "roxo", "roxo", "roxo", "cinza"]
        ];
        const table_resFisMag = [
            [-2, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20],
            [-1, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20],
            [ 0, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20, 20],
            [ 1, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20, 20],
            [ 2, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20, 20],
            [ 3,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20, 20],
            [ 4,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 20],
            [ 5,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20],
            [ 6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20],
            [ 7,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19],
            [ 8,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19],
            [ 9,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18, 18],
            [10,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17, 18],
            [11,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17, 17],
            [12,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16, 17],
            [13,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16, 16],
            [14,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15, 16],
            [15,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15, 15],
            [16,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14, 15],
            [17,  2,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13, 14],
            [18,  2,  2,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12, 13],
            [19,  2,  2,  2,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11, 12],
            [20,  2,  2,  2,  2,  2,  2,  3,  3,  4,  4,  5,  5,  6,  6,  7,  7,  8,  9, 10, 11]
        ];
        if (profissoes[0]) {
            especializacoes = profissoes[0].data.especializacoes.split(",");
        } // Alow
        if (h_prof.length > 1) h_prof.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_man.length > 1) h_man.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_con.length > 1) h_con.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_sub.length > 1) h_sub.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_inf.length > 1) h_inf.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (h_geral.length > 1) h_geral.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (magias.length > 1) magias.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (combate.length > 1) combate.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (tecnicas.length > 1) tecnicas.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (tecnicas.length > 1) tecnicas.sort(function (a, b) {
            return a.data.categoria.localeCompare(b.data.categoria);
        });
        if (defesas.length > 1) defesas.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (pertences.length > 1) pertences.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (transportes.length > 1) transportes.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (pertences_transporte.length > 1) pertences_transporte.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        if (efeitos.length > 1) efeitos.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
        actorData.efeitos = efeitos;
        this.efeitos = efeitos;
        this.table_resFisMag = table_resFisMag;
        this.tabela_resol = tabela_resol;
        actorData.especializacoes = especializacoes;
        actorData.raca = racas[0];
        actorData.profissao = profissoes[0];
        this.raca = actorData.raca;
        this.profissao = actorData.profissao;
        actorData.pertences_transporte = pertences_transporte;
        actorData.pertences = pertences;
        actorData.defesas = defesas;
        actorData.transportes = transportes;
        actorData.tecnicas = tecnicas;
        actorData.h_prof = h_prof;
        actorData.h_man = h_man;
        actorData.h_con = h_con;
        actorData.h_sub = h_sub;
        actorData.h_inf = h_inf;
        actorData.h_geral = h_geral;
        actorData.combate = combate;
        actorData.magias = magias;
    }

    _preparaCaracRaciais(sheetData, updatePers) {
        if (!this.options.editable) return;
        const actorData = sheetData.actor;
        if (actorData.raca) {
            const racaData = actorData.raca.data;
            if (actorData.data.data.raca != actorData.raca.name)
            {
                updatePers['data.raca'] = actorData.raca.name;
                updatePers['data.mod_racial.INT'] = racaData.mod_racial.INT;
                updatePers['data.mod_racial.AUR'] = racaData.mod_racial.AUR;
                updatePers['data.mod_racial.CAR'] = racaData.mod_racial.CAR;
                updatePers['data.mod_racial.FOR'] = racaData.mod_racial.FOR;
                updatePers['data.mod_racial.FIS'] = racaData.mod_racial.FIS;
                updatePers['data.mod_racial.AGI'] = racaData.mod_racial.AGI;
                updatePers['data.mod_racial.PER'] = racaData.mod_racial.PER;
            } 
        }
    }

    somaPontos(atributo) {
        if (atributo <= -1) {
            return (atributo/2);
        } else if (atributo == 0) {
            return 0;
        } else if (atributo == 1) {
            return 1;
        } else if (atributo > 1) {
            return atributo + this.somaPontos(atributo - 1);
        }
    }

    _setPontosRaca(sheetData, updatePers){
        if (!this.options.editable) return;
        const actorData = sheetData.actor.data;
        const raca = actorData.data.raca;
        const estagio = actorData.data.estagio;
        let pontos = 14;
        let g_int = 0;
        let g_aur = 0;
        let g_car = 0;
        let g_for = 0;
        let g_fis = 0;
        let g_agi = 0;
        let g_per = 0;
        if (raca === "Humano") pontos = 15;

        for (let x = 0; x <= estagio; x++) {
            if ((x % 2) != 0) pontos += 1;
        }

        if ((actorData.data.atributos.INT > actorData.data.mod_racial.INT) && (actorData.data.mod_racial.INT > 0)) { 
            pontos -= this.somaPontos(actorData.data.atributos.INT) - this.somaPontos(actorData.data.mod_racial.INT);
            g_int = this.somaPontos(actorData.data.atributos.INT) - this.somaPontos(actorData.data.mod_racial.INT);
        } else if ((actorData.data.atributos.INT > actorData.data.mod_racial.INT) && (actorData.data.mod_racial.INT < 0)) {
            pontos -= (this.somaPontos(actorData.data.atributos.INT) - actorData.data.mod_racial.INT);
            g_int = (this.somaPontos(actorData.data.atributos.INT) - actorData.data.mod_racial.INT);
        } else {
            pontos -= this.somaPontos(actorData.data.atributos.INT - actorData.data.mod_racial.INT);
            g_int = this.somaPontos(actorData.data.atributos.INT - actorData.data.mod_racial.INT);
        }

        if ((actorData.data.atributos.AUR > actorData.data.mod_racial.AUR) && (actorData.data.mod_racial.AUR > 0)) {
            pontos -= this.somaPontos(actorData.data.atributos.AUR) - this.somaPontos(actorData.data.mod_racial.AUR);
            g_aur = this.somaPontos(actorData.data.atributos.AUR) - this.somaPontos(actorData.data.mod_racial.AUR);
        } else if ((actorData.data.atributos.AUR > actorData.data.mod_racial.AUR) && (actorData.data.mod_racial.AUR < 0)) {
            pontos -= (this.somaPontos(actorData.data.atributos.AUR) - actorData.data.mod_racial.AUR);
            g_aur = (this.somaPontos(actorData.data.atributos.AUR) - actorData.data.mod_racial.AUR);
        } else {
            pontos -= this.somaPontos(actorData.data.atributos.AUR - actorData.data.mod_racial.AUR);
            g_aur = this.somaPontos(actorData.data.atributos.AUR - actorData.data.mod_racial.AUR);
        }

        if ((actorData.data.atributos.CAR > actorData.data.mod_racial.CAR) && (actorData.data.mod_racial.CAR > 0)) {
            pontos -= this.somaPontos(actorData.data.atributos.CAR) - this.somaPontos(actorData.data.mod_racial.CAR);
            g_car = this.somaPontos(actorData.data.atributos.CAR) - this.somaPontos(actorData.data.mod_racial.CAR);
        } else if ((actorData.data.atributos.CAR > actorData.data.mod_racial.CAR) && (actorData.data.mod_racial.CAR < 0)) {
            pontos -= (this.somaPontos(actorData.data.atributos.CAR) - actorData.data.mod_racial.CAR);
            g_car = (this.somaPontos(actorData.data.atributos.CAR) - actorData.data.mod_racial.CAR);
        } else {
            pontos -= this.somaPontos(actorData.data.atributos.CAR - actorData.data.mod_racial.CAR);
            g_car = this.somaPontos(actorData.data.atributos.CAR - actorData.data.mod_racial.CAR);
        }

        if ((actorData.data.atributos.FOR > actorData.data.mod_racial.FOR) && (actorData.data.mod_racial.FOR > 0)) {
            pontos -= this.somaPontos(actorData.data.atributos.FOR) - this.somaPontos(actorData.data.mod_racial.FOR);
            g_for = this.somaPontos(actorData.data.atributos.FOR) - this.somaPontos(actorData.data.mod_racial.FOR);
        } else if ((actorData.data.atributos.FOR > actorData.data.mod_racial.FOR) && (actorData.data.mod_racial.FOR < 0)) {
            pontos -= (this.somaPontos(actorData.data.atributos.FOR) - actorData.data.mod_racial.FOR);
            g_for = (this.somaPontos(actorData.data.atributos.FOR) - actorData.data.mod_racial.FOR);
        } else {
            pontos -= this.somaPontos(actorData.data.atributos.FOR - actorData.data.mod_racial.FOR);
            g_for = this.somaPontos(actorData.data.atributos.FOR - actorData.data.mod_racial.FOR);
        }

        if ((actorData.data.atributos.FIS > actorData.data.mod_racial.FIS) && (actorData.data.mod_racial.FIS > 0)) {
            pontos -= this.somaPontos(actorData.data.atributos.FIS) - this.somaPontos(actorData.data.mod_racial.FIS);
            g_fis = this.somaPontos(actorData.data.atributos.FIS) - this.somaPontos(actorData.data.mod_racial.FIS);
        } else if ((actorData.data.atributos.FIS > actorData.data.mod_racial.FIS) && (actorData.data.mod_racial.FIS < 0)) {
            pontos -= (this.somaPontos(actorData.data.atributos.FIS) - actorData.data.mod_racial.FIS);
            g_fis = (this.somaPontos(actorData.data.atributos.FIS) - actorData.data.mod_racial.FIS);
        } else {
            pontos -= this.somaPontos(actorData.data.atributos.FIS - actorData.data.mod_racial.FIS);
            g_fis = this.somaPontos(actorData.data.atributos.FIS - actorData.data.mod_racial.FIS);
        }

        if ((actorData.data.atributos.AGI > actorData.data.mod_racial.AGI) && (actorData.data.mod_racial.AGI > 0)) {
            pontos -= this.somaPontos(actorData.data.atributos.AGI) - this.somaPontos(actorData.data.mod_racial.AGI);
            g_agi = this.somaPontos(actorData.data.atributos.AGI) - this.somaPontos(actorData.data.mod_racial.AGI);
        } else if ((actorData.data.atributos.AGI > actorData.data.mod_racial.AGI) && (actorData.data.mod_racial.AGI < 0)) {
            pontos -= (this.somaPontos(actorData.data.atributos.AGI) - actorData.data.mod_racial.AGI);
            g_agi = (this.somaPontos(actorData.data.atributos.AGI) - actorData.data.mod_racial.AGI);
        } else {
            pontos -= this.somaPontos(actorData.data.atributos.AGI - actorData.data.mod_racial.AGI);
            g_agi = this.somaPontos(actorData.data.atributos.AGI - actorData.data.mod_racial.AGI);
        }

        if ((actorData.data.atributos.PER > actorData.data.mod_racial.PER) && (actorData.data.mod_racial.PER > 0)) {
            pontos -= this.somaPontos(actorData.data.atributos.PER) - this.somaPontos(actorData.data.mod_racial.PER);
            g_per = this.somaPontos(actorData.data.atributos.PER) - this.somaPontos(actorData.data.mod_racial.PER);
        } else if ((actorData.data.atributos.PER > actorData.data.mod_racial.PER) && (actorData.data.mod_racial.PER < 0)) {
            pontos -= (this.somaPontos(actorData.data.atributos.PER) - actorData.data.mod_racial.PER);
            g_per = (this.somaPontos(actorData.data.atributos.PER) - actorData.data.mod_racial.PER);
        } else {
            pontos -= this.somaPontos(actorData.data.atributos.PER - actorData.data.mod_racial.PER);
            g_per = this.somaPontos(actorData.data.atributos.PER - actorData.data.mod_racial.PER);
        }
        
        if (pontos != actorData.data.carac_final.INT) {
            updatePers['data.carac_final.INT'] = pontos;
            updatePers['data.carac_sort.INT'] = g_int;
            updatePers['data.carac_sort.AUR'] = g_aur;
            updatePers['data.carac_sort.CAR'] = g_car;
            updatePers['data.carac_sort.FOR'] = g_for;
            updatePers['data.carac_sort.FIS'] = g_fis;
            updatePers['data.carac_sort.AGI'] = g_agi;
            updatePers['data.carac_sort.PER'] = g_per;
        }
    }

    _prepareValorTeste(sheetData, updatePers){
        if (!this.options.editable) return;
        const actorData = sheetData.actor.data;
        if (actorData.data.valor_teste.INT != actorData.data.atributos.INT*4 || actorData.data.valor_teste.AUR != actorData.data.atributos.AUR*4 || actorData.data.valor_teste.CAR != actorData.data.atributos.CAR*4 || actorData.data.valor_teste.FOR != actorData.data.atributos.FOR*4 || actorData.data.valor_teste.FIS != actorData.data.atributos.FIS*4 || actorData.data.valor_teste.AGI != actorData.data.atributos.AGI*4 || actorData.data.valor_teste.PER != actorData.data.atributos.PER*4) {
            updatePers["data.valor_teste.INT"] = actorData.data.atributos.INT*4;
            updatePers["data.valor_teste.AUR"] = actorData.data.atributos.AUR*4;
            updatePers["data.valor_teste.CAR"] = actorData.data.atributos.CAR*4;
            updatePers["data.valor_teste.FOR"] = actorData.data.atributos.FOR*4;
            updatePers["data.valor_teste.FIS"] = actorData.data.atributos.FIS*4;
            updatePers["data.valor_teste.AGI"] = actorData.data.atributos.AGI*4;
            updatePers["data.valor_teste.PER"] = actorData.data.atributos.PER*4;
        }
    }
}