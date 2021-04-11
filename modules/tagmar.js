import tagmarItemSheet from "./sheets/tagmarItemSheet.js";
import tagmarActorSheet from "./sheets/tagmarActorSheet.js";
import { tagmarItem } from "./tagmarItem.js";
import { preloadHandlebarsTemplates } from "./templates.js";
import { SystemSettings } from "./settings.js";

Hooks.once("init", function(){

  game.tagmar = {
    tagmarItem,
    rollItemMacro
  };

  CONFIG.Combat.initiative = {
    formula: "1d10 + @iniciativa",
    decimals: 2
  };
  CONFIG.Item.entityClass = tagmarItem;
  // Register System Settings
  SystemSettings();
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("tagmar", tagmarItemSheet, {makeDefault: true});

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("tagmar", tagmarActorSheet, {makeDefault: true});

  Handlebars.registerHelper('ifeq', function (a, b, options) {
    if (a == b) { return options.fn(this); }
    return options.inverse(this);
  });

  Handlebars.registerHelper('ifgr', function (a, b, options) {
    if (a > b) { return options.fn(this); }
    return options.inverse(this);
  });

  Handlebars.registerHelper('ifle', function (a, b, options) {
    if (a <= b) { return options.fn(this); }
    return options.inverse(this);
  });

  Handlebars.registerHelper('ifdf', function (a, b, options) {
    if (a != b) { return options.fn(this); }
    return options.inverse(this);
  });

  Handlebars.registerHelper('ifind', function (a, b, options) {
    const a_list = a.split(',');
    const found = a_list.find(element => element == b);
    if (found) {
      return options.fn(this);
    } 
    return options.inverse(this);
  });

  Handlebars.registerHelper('idfind', function (a, b, options) {
    const a_list = a.split(',');
    const found = a_list.find(element => element == b);
    if (!found) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('soma', function(a, b, c, d, options) {
    let soma = a + b + c + d;
    return soma;
  });

  Handlebars.registerHelper('multiplica', function(a, b, options) {
    let mult = a * b;
    return mult.toFixed(2);
  });

  Handlebars.registerHelper('toFixed', function(value, decimal, options) {
    return value.toFixed(decimal);
  });

  Handlebars.registerHelper('settingTrue', function(setting, options) {
    if (game.settings.get('tagmar', setting)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('settingFalse', function(setting, options) {
    if (!game.settings.get('tagmar', setting)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  preloadHandlebarsTemplates();
  
});

Hooks.once("ready", async function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createTagmarMacro(data, slot));
  boasVindas();
});

function boasVindas () {
  if(!game.user.getFlag("tagmar","boasVindas")) {
    let content = '<img src="/systems/tagmar/assets/TAGMAR FOUNDRY.png" style="display: block; margin-left: auto; margin-right: auto;" /><h1 class="fairyDust rola" style="text-align:center;">Tagmar RPG</h1>';
    let text = '<p class="rola_desc mediaeval">Conheça sobre o <a href="https://tagmar.com.br/" title="Acessar o site de Tagmar">Projeto Tagmar</a>.</p>';
    let sys_text = '<p class="rola_desc mediaeval">Saiba mais sobre o sistema <a href="https://foundryvtt.com/packages/tagmar">Tagmar RPG no Foundry</a> e também no <a href="https://github.com/marcoswalker/tagmar">GitHub</a>.</p>';
    let credits = '<p class="rola_desc"><span class="creditos mediaeval">por Vinicius Fernandez (Pirata) e Marcos Walker</span></p>'
    let options = {
      whisper:[game.user.id],
      content: content + text + sys_text + credits
    };
    ChatMessage.create(options);
    game.user.setFlag("tagmar", "boasVindas", true);
  }
}

Hooks.on("createToken", async function(scene, token) {
  if (!game.user.isGM) return;
  if (!token.actorLink) {
    try {
      let tokenA = canvas.tokens.get(token._id);
      let tokenactor = tokenA.actor;
      await tokenactor.update({
        'name': tokenA.actor.name + " Cópia"
      });
      let actor = await Actor.create(tokenactor);
      tokenA.update({
        'actorId': actor._id,
        'actorLink': true
      });
    } catch (e) {
      ui.notifications.error(e);
    }
  }
});

Hooks.on("preCreateToken", function(_scene, data) {
  if (!game.user.isGM) return;
  const setting = game.settings.get("tagmar", "autoBars");
  const actor = game.actors.get(data.actorId);
  if (setting == "barra_pers") {
    if (actor.data.type == "Personagem") {
      setProperty(data, "flags.barbrawl.resourceBars", {
        "bar1": {
            id: "bar1",
            mincolor: "#fbff00",
            maxcolor: "#00ff08",
            position: "top-outer",
            attribute: "eh",
            visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            ignoreMax: true
        },
        "bar2": {
          id: "bar2",
          mincolor: "#fbff00",
          maxcolor: "#6b6b6b",
          position: "top-outer",
          attribute: "absorcao",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        },
        "bar3": {
          id: "bar3",
          mincolor: "#fbff00",
          maxcolor: "#ff0000",
          position: "top-outer",
          attribute: "ef",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
          ignoreMax: true,
          ignoreMin: true
        },
        "bar4": {
          id: "bar4",
          mincolor: "#fbff00",
          maxcolor: "#a600ff",
          position: "bottom-outer",
          attribute: "karma",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        },
        "bar5": {
          id: "bar5",
          mincolor: "#fbff00",
          maxcolor: "#003399",
          position: "bottom-outer",
          attribute: "focus",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        }
      });
    }
  } else if (setting == "barra_npc") {
    if (actor.data.type == "NPC") {
      setProperty(data, "flags.barbrawl.resourceBars", {
        "bar1": {
            id: "bar1",
            mincolor: "#fbff00",
            maxcolor: "#00ff08",
            position: "bottom-outer",
            attribute: "eh_npc",
            visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            ignoreMax: true
        },
        "bar2": {
          id: "bar2",
          mincolor: "#fbff00",
          maxcolor: "#6b6b6b",
          position: "bottom-outer",
          attribute: "absorcao",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        },
        "bar3": {
          id: "bar3",
          mincolor: "#fbff00",
          maxcolor: "#ff0000",
          position: "bottom-outer",
          attribute: "ef_npc",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
          ignoreMax: true,
          ignoreMin: true
        },
        "bar4": {
          id: "bar4",
          mincolor: "#fbff00",
          maxcolor: "#a600ff",
          position: "bottom-outer",
          attribute: "karma_npc",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        }
      });
    }
  } else if (setting == "barra_both") {
    if (actor.data.type == "Personagem") {
      setProperty(data, "flags.barbrawl.resourceBars", {
        "bar1": {
            id: "bar1",
            mincolor: "#fbff00",
            maxcolor: "#00ff08",
            position: "top-outer",
            attribute: "eh",
            visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            ignoreMax: true
        },
        "bar2": {
          id: "bar2",
          mincolor: "#fbff00",
          maxcolor: "#6b6b6b",
          position: "top-outer",
          attribute: "absorcao",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        },
        "bar3": {
          id: "bar3",
          mincolor: "#fbff00",
          maxcolor: "#ff0000",
          position: "top-outer",
          attribute: "ef",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
          ignoreMax: true,
          ignoreMin: true
        },
        "bar4": {
          id: "bar4",
          mincolor: "#fbff00",
          maxcolor: "#a600ff",
          position: "bottom-outer",
          attribute: "karma",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        },
        "bar5": {
          id: "bar5",
          mincolor: "#fbff00",
          maxcolor: "#003399",
          position: "bottom-outer",
          attribute: "focus",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        }
      });
    } else if (actor.data.type == "NPC") {
      setProperty(data, "flags.barbrawl.resourceBars", {
        "bar1": {
            id: "bar1",
            mincolor: "#fbff00",
            maxcolor: "#00ff08",
            position: "bottom-outer",
            attribute: "eh_npc",
            visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
            ignoreMax: true
        },
        "bar2": {
          id: "bar2",
          mincolor: "#fbff00",
          maxcolor: "#6b6b6b",
          position: "bottom-outer",
          attribute: "absorcao",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        },
        "bar3": {
          id: "bar3",
          mincolor: "#fbff00",
          maxcolor: "#ff0000",
          position: "bottom-outer",
          attribute: "ef_npc",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER,
          ignoreMax: true,
          ignoreMin: true
        },
        "bar4": {
          id: "bar4",
          mincolor: "#fbff00",
          maxcolor: "#a600ff",
          position: "bottom-outer",
          attribute: "karma_npc",
          visibility: CONST.TOKEN_DISPLAY_MODES.OWNER_HOVER
        }
      });
    }
  }
});

let dragRulerApi;

export function tagmarGetColorForDistance(startDistance, subDistance=0) {
	if (!this.isDragRuler)
		return this.color;
	// Tagmar Changes
  if (!((this.draggedToken.actor.data.type === "Personagem" || this.draggedToken.actor.data.type === "NPC") && game.settings.get('drag-ruler', "alwaysShowSpeedForPCs")))
			return this.color;
	const distance = startDistance + subDistance;
	const ranges = dragRulerApi.getRangesFromSpeedProvider(this.draggedToken);
	if (ranges.length === 0)
		return this.color;
	const currentRange = ranges.reduce((minRange, currentRange) => {
		if (distance <= currentRange.range && currentRange.range < minRange.range)
			return currentRange;
		return minRange;
	}, {range: Infinity, color: dragRulerApi.getUnreachableColorFromSpeedProvider()})
	return currentRange.color;
}

Hooks.once("dragRuler.ready", (SpeedProvider) => {
  import('/modules/drag-ruler/src/api.js')
  .then((module) => {
    dragRulerApi = module;
  });
  dragRuler.getColorForDistance = tagmarGetColorForDistance;
  class TagmarSpeedProvider extends SpeedProvider {
      get colors() {
          return [
              {id: "walk", default: 0xFFFF00, name: "tagmar.speeds.walk"},
              {id: "dash", default: 0x00FF00, name: "tagmar.speeds.dash"},
              {id: "run", default: 0xFF8000, name: "tagmar.speeds.run"}
          ];
      }

      getRanges(token) {
          const baseSpeed = token.actor.data.data.vb;

    // A character can always walk it's base speed and dash twice it's base speed
    const ranges = [
      {range: baseSpeed, color: "walk"},
      {range: baseSpeed / 2, color: "dash"}
    ];
          return ranges;
      }
  }

  dragRuler.registerSystem("tagmar", TagmarSpeedProvider);
});

Hooks.on('renderChatMessage', function (message, jq, messageData) {
  const fonte_size = game.settings.get('tagmar', 'fonteMsg');
  const rola_desc = jq.find('.rola_desc');
  if (fonte_size > 0) $(rola_desc).css('font-size', fonte_size.toString()+'%');
  else $(rola_desc).css('font-size', '100%');
});

Hooks.on('tagmar_Critico', async function (coluna, tabela_resol, user, actor) {
  if (game.user !== user) return;
  await rolarCritico(coluna, tabela_resol, user, actor);
});

async function rolarCritico(coluna, tabela_resol, user, actor) {
  let roll = new Roll('1d20');
  roll.evaluate();
  let result = roll.total;
  let conteudo = "";
  for (let col of tabela_resol) {
    if (col[0] === coluna) {
      let resultado = col[result];
      if (resultado == "cinza") {
        conteudo = "<h1 class='mediaeval rola' style='text-align:center;'>Rolagem do Crítico</h1><br><h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico</h1>";
        conteudo = conteudo + "<br><p class='mediaeval rola_desc'><b>Corte: </b>O Oponente é decapitado.<br><b>Esmagamento: </b>Afundamento torácico destrói os pulmões.<br><b>Penetração: </b>Golpe perfura o coração.<br><b>Garras/Mordida: </b>Força do golpe rasga a carótida.<br><b>Magia: </b>Impacto total da magia mata o adversário.<br><b>Falha: </b>Um golpe ruim. Erra o adversário.</p>";
      } else if (resultado == "roxo") {
        conteudo = "<h1 class='mediaeval rola' style='text-align:center;'>Rolagem do Crítico</h1><br><h1 class='mediaeval rola' style='color: white; text-align:center;background-color:rgb(2,9,37);'>Azul Escuro - 125%</h1>";
        conteudo = conteudo + "<br><p class='mediaeval rola_desc'><b>Corte: </b>100%. Corte vaza o olho. A dor paralisa o adversário por duas rodadas.<br><b>Esmagamento: </b>100%. Golpe no pulso destrói a articulação, obrigando a amputação em 2 dias. O inimigo é paralisado por duas rodadas.<br><b>Penetração: </b>100%. Estocada na mão, inutiliza permanentemente. A dor paralisa o inimigo por duas rodadas.<br><b>Garras/Mordida: </b>100%. Ataque no olho arranca o globo ocular e paralisa o adversário por duas rodadas.<br><b>Magia: </b>100% Impacto no pé do adversário o destrói, e ele fica paralisado por duas rodadas.<br><b>Falha: </b>Descontrole dá um ajuste de – 3 nas próximas duas rodadas.</p>";
      } else if (resultado == "azul") {
        conteudo = "<h1 class='mediaeval rola' style='text-align:center;'>Rolagem do Crítico</h1><br><h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - 100%</h1>";
        conteudo = conteudo + "<br><p class='mediaeval rola_desc'><b>Corte: </b>100%. Corte grande no músculo inutiliza um braço por uma semana.<br><b>Esmagamento: </b>100%. Pancada na cabeça. Elmo se parte (caso não seja mágico). Se não tiver Elmo entra em coma por 2 dias.<br><b>Penetração: </b>100%. Perfura o músculo do braço e o inutiliza por uma semana.<br><b>Garras/Mordida: </b>100%. Ataque arranca uma orelha e paralisa o adversário por uma rodada.<br><b>Magia: </b>100%. O poder da magia leva o inimigo a inconsciência por um dia.<br><b>Falha: </b>Descontrole dá um ajuste de – 4 nas próximas 3 rodadas.</p>";
      } else if (resultado == "vermelho") {
        conteudo = "<h1 class='mediaeval rola' style='text-align:center;'>Rolagem do Crítico</h1><br><h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - 75%</h1>";
        conteudo = conteudo + "<br><p class='mediaeval rola_desc'><b>Corte: </b>75%. Corte mediano no músculo inutiliza um braço por 2 dias.<br><b>Esmagamento: </b>75%. Pancada na cabeça. Elmo se parte (caso não seja mágico). Se não tiver Elmo fica desacordado por 2 horas e incapacito por 2 dias.<br><b>Penetração: </b>75%. Perfura o músculo do braço e o inutiliza por 2 dias.<br><b>Garras/Mordida: </b>75%. Ataque rasga o braço causando um ajuste de - 8 por 2 dias.<br><b>Magia: </b>75%. O poder da magia leva o inimigo a inconsciência por meia hora.<br><b>Falha: </b>Ataque precipitado causa 25 % de dano em si mesmo.</p>";
      } else if (resultado == "laranja") {
        conteudo = "<h1 class='mediaeval rola' style='text-align:center;'>Rolagem do Crítico</h1><br><h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - 50%</h1>";
        conteudo = conteudo + "<br><p class='mediaeval rola_desc'><b>Corte: </b>75%. Corte na cabeça põe adversário em coma por 1 dia se ele não tiver usando elmo.<br><b>Esmagamento: </b>75%. Escudo do inimigo se quebra (caso não seja mágico). Na ausência deste o braço quebra (cura em um mês).<br><b>Penetração: </b>75%. Golpe no tronco derruba o adversário se estiver usando escudo. Caso contrário incapacita-o por 2 dias.<br><b>Garras/Mordida: </b>75%. A ferocidade do golpe derruba o adversário impedindo de atacar nas próximas 3 rodadas.<br><b>Magia: </b>75%. O potente impacto paralisa o adversário, impedindo de atacar nas próximas 3 rodadas.<br><b>Falha: </b>Ataque desastroso causa 50 % de dano em si mesmo.</p>";
      } else if (resultado == "amarelo") {
        conteudo = "<h1 class='mediaeval rola' style='text-align:center;'>Rolagem do Crítico</h1><br><h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - 25%</h1>";
        conteudo = conteudo + "<br><p class='mediaeval rola_desc'><b>Corte: </b>50%. Com um belo golpe, não só atinge como desarma o inimigo.<br><b>Esmagamento: </b>50%. Golpe no tórax derruba o adversário, que deixa cair o que tiver segurando.<br><b>Penetração: </b>50% Estocada no peito paralisa o adversário nas próximas 2 rodadas.<br><b>Garras/Mordida: </b>50%. Feroz ataque na mão desarma o inimigo.<br><b>Magia: </b>50%. A força da magia arremessa o adversário a 2 metros de distância, e ele deixa cair sua arma.<br><b>Falha: </b>Sua arma escapa da sua mão, caindo a 3 metros de distância.</p>";
      } else if (resultado == "branco") {
        conteudo = "<h1 class='mediaeval rola' style='text-align:center;'>Rolagem do Crítico</h1><br><h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Errou</h1>";
        conteudo = conteudo + "<br><p class='mediaeval rola_desc'><b>Corte: </b>50%. Corte no ombro, impõe um ajuste de – 4 por 1 dia.<br><b>Esmagamento: </b>50%. Golpe duro no ombro, paralisa o oponente na próxima rodada.<br><b>Penetração: </b>50%. Penetração causa ajuste de – 4 por 2 dias. Se for flecha o ajuste é de - 6 até que a mesma seja retirada.<br><b>Garras/Mordida: </b>50%. Rasgo na mão impede o adversário de realizar seu próximo ataque.<br><b>Magia: </b>50%. O poder da magia atordoa o inimigo, impedindo de realizar seu próximo ataque.<br><b>Falha: </b>Tropeção o impede de realizar seu próximo ataque.</p>";
      } else if (resultado == "verde") {
        conteudo = "<h1 class='mediaeval rola' style='text-align:center;'>Rolagem do Crítico</h1><br><h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha Crítica</h1>";
        conteudo = conteudo + "<br><p class='mediaeval rola_desc'><b>Corte: </b>25%. Corte leve no músculo do braço dá um ajuste de – 4 na próxima rodada.<br><b>Esmagamento: </b>25%. Golpe no ombro desequilibra o adversário na próxima rodada, dando um ajuste de – 4.<br><b>Penetração: </b>25% Estocada na perna reduz o movimento à metade e causa um ajuste de – 2 por 1 hora.<br><b>Garras/Mordida: </b>25%. Ataque desequilibra o inimigo, levando-o a cair e perder uma rodada.<br><b>Magia: </b>25%. A magia foi evocada com maestria. Economizando 1 de karma OU causando +2 na FA.<br><b>Falha: </b>Faça um ataque no seu companheiro mais próximo.</p>";
      }
      roll.toMessage({
        user: user,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
        flavor: conteudo
      });
    }
  }
}

document.addEventListener('auxclick', function (event) {
  if (event.button == 1 && game.user.isGM) {
    const hoveredToken = canvas.tokens._hover;
    if (hoveredToken !== null) {
      if (!hoveredToken.isTargeted) hoveredToken.setTarget(true, game.user, true, false);
      else hoveredToken.setTarget(false);
    }
  }
})

Hooks.on('targetToken', function (user, token, targeted) {
  if (!(token.actor.data.type === "Personagem" || token.actor.data.type === "NPC")) return;
  const setting_target = game.settings.get("tagmar", "autoTarget");
  if (targeted && setting_target == "yes") setInf_ataque(token, user);
});

function setInf_ataque(target_token, user) {
  if (user == game.user) {
    const speaker = ChatMessage.getSpeaker();
    let actor = game.actors.get(speaker.actor);
    if (!actor) return ui.notifications.warn("Selecione um Token para setar Def. Oponente!");
    if (actor.data.type == "Inventario") return ui.notifications.error("Não é possível atacar com um Inventário.");
    actor.update({
      'data.inf_ataque.cat_def': target_token.actor.data.data.d_ativa.categoria,
      'data.inf_ataque.valor_def': target_token.actor.data.data.d_ativa.valor
    });
    let chatData = {
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({
          actor: actor
        })
    };
    let target_def = target_token.actor.data.data.d_ativa;
    chatData.content = "<p><img src='"+ actor.img +"' style='float: left; margin-left: auto; margin-right: auto; width: 40%;border: 0px;' /><img src='systems/tagmar/assets/TAGMAR FOUNDRY.png' style='float: left;margin-top:25px; margin-left: auto; margin-right: auto; width: 20%;border: 0px;'/><img src='"+ target_token.actor.img +"' style='float: left; width: 40%; margin-left: auto; margin-right: auto;border: 0px;' /></p><p class='rola_desc' style='display: block;margin-left:auto;margin-right:auto;margin-top:60%;'>"+ "<b>Agressor: </b>" + actor.data.name + "<br><b>Bônus de Ataque: </b>"+ String(actor.data.data.inf_ataque.bonus) +"<br><b>Oponente: </b>" + target_token.actor.data.name  +"<br><b>Def. Oponente: </b>"+ target_def.categoria + String(target_def.valor) +"</p>";
    ChatMessage.create(chatData);
  }
}

Hooks.on("getSceneControlButtons", (controls) => {
  const bar = controls.find(c => c.name === "token");
  if (game.user.isGM) {
    bar.tools.push({
      name: "Centralizar Canvas",
      icon: "fas fa-anchor",
      title: "Centralizar Canvas",
      onClick: async () => canvas.recenter(),
      button: true
    });
    bar.tools.push({
      name: "Rolar direto na tabela ou Teste de Resistência",
      icon: "fas fa-dice-d20",
      title: "Rolagem do Mestre",
      onClick: async () => rollDialog(),
      button: true
    });
  } else {
    bar.tools.push({
      name: "Centralizar Canvas",
      icon: "fas fa-anchor",
      title: "Centralizar Canvas",
      onClick: async () => canvas.recenter(),
      button: true
    });
  }
});

async function rollDialog() {
  $.get("systems/tagmar/templates/roll_dialog.hbs", function (data) {
    let dialog = new Dialog({
      title: "Rolagem do Mestre",
      content: data,
      buttons: {},
      render: (html) => {
        html.find(".rollResist").click(async function (event) {
          let resist = html.find('.ip_resist').val();
          let f_ataque = html.find(".ip_fAtaque").val();
          if (resist > 0 && f_ataque > 0) await rollResistencia(resist, f_ataque);
          html.find('.ip_resist').val("");
          html.find(".ip_fAtaque").val("");
        });
        html.find(".rollTabela").click(async function (event) {
          let coluna = html.find(".ip_coluna").val();
          if (coluna >= -7 && coluna <= 20) await rollTabela(coluna);
          html.find(".ip_coluna").val("");
        });
      }
    });
    dialog.render(true);
  });
}

async function rollTabela(colunaR) {
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
  let r = new Roll("1d20");
  let resultado = "";
  let PrintResult = "";
  r.evaluate();
  var Dresult = r.total;
  for (let i = 0; i < tabela_resol.length; i++) {
    if (tabela_resol[i][0] == colunaR) {
        resultado = tabela_resol[i][Dresult];
        if (resultado == "verde") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:green;'>Verde - Falha</h1>";
        else if (resultado == "branco") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:white;'>Branco - Rotineiro</h1>";
        else if (resultado == "amarelo") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:yellow;'>Amarelo - Fácil</h1>";
        else if (resultado == "laranja") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:orange;'>Laranja - Médio</h1>";
        else if (resultado == "vermelho") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:red;'>Vermelho - Difícil</h1>";
        else if (resultado == "azul" ) PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:blue;'>Azul - Muito Difícil</h1>";
        else if (resultado == "roxo") PrintResult = "<h1 class='mediaeval rola' style='color: white; text-align:center;background-color:rgb(2,9,37);'>Azul Escuro - Muito Difícil</h1>";
        else if (resultado == "cinza") PrintResult = "<h1 class='mediaeval rola' style='color: black; text-align:center;background-color:gray;'>Cinza - Crítico Absurdo</h1>";
        let coluna = "<h4 class='mediaeval rola'>Coluna:" + tabela_resol[i][0] + "</h4>";
        r.toMessage({
            user: game.user._id,
            speaker: ChatMessage.getSpeaker({ user: game.user }),
            flavor: `<h2 class='mediaeval rola'>Rolagem - ${colunaR}</h2>${coluna}${PrintResult}`
          });
    }
  }
}

async function rollResistencia(resist, f_ataque) {
  let forcAtaque = f_ataque;
  let valorDef = resist;
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
  r.evaluate();
  const Dresult = r.total;
  if (Dresult >= valorSucess) { // Sucesso
      stringSucesso = "<h1 class='mediaeval rola' style='text-align:center; color: white;background-color:blue;'>SUCESSO</h1>";
  } else {    // Insucesso
      stringSucesso = "<h1 class='mediaeval rola' style='text-align:center; color: white;background-color:red;'>FRACASSO</h1>";
  }  
  r.toMessage({
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ user: game.user }),
      flavor: `<h2 class="mediaeval rola">Teste de Resistência </h2><h3 class="mediaeval rola"> Força Ataque: ${forcAtaque}</h3><h3 class="mediaeval rola">Resistência: ${valorDef}</h3>${stringSucesso}`
  });
}

async function createTagmarMacro(data, slot) {
  if (data.type !== "Item") return;
  if (!("data" in data)) return ui.notifications.warn("Você só pode criar Macros para Ataques, Magias e Poderes. Você pode referenciar atributos e perícias com @. Ex.: @for ou @luta");
  const item = data.data;
  // const actor = getItemOwner(item);
  // Create the macro command
  const command = `game.tagmar.rollItemMacro("${item.name}");`;

  let macro = game.macros.entities.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: {
        "tagmar.itemMacro": true
      }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName, extra) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName && i.type != "Pertence" && i.type != "Transporte" && i.type != "Defesa") : null;
  if (!item) return ui.notifications.warn(`O personagem selecionado não possui um Item chamado ${itemName}`);
  // console.log(item);
  // Trigger the item roll
  return item.rollTagmarItem();
}
