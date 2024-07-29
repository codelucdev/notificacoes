document.addEventListener('DOMContentLoaded', function() {
    const tipoSelect = document.getElementById('tipo');

    // Redefine o campo de seleção para o valor padrão quando a página for carregada
    tipoSelect.selectedIndex = 0;

    // Adiciona o evento de mudança para redirecionar conforme a seleção
    tipoSelect.addEventListener('change', function() {
        var tipo = tipoSelect.value;
        if (tipo == "COPASA") {
            window.location.href = "copasa/index.html"; 
        } else if (tipo == "LOTE-SUJO") {
            window.location.href = "lotesujo/index.html"; 
        } else if (tipo == "CARRO_ABANDONADO") {
            window.location.href = "carroabandonado/index.html";
        }
    });

    // Força a atualização quando o usuário navega de volta para a página
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    });

    document.getElementById('gerarPDF').addEventListener('click', function() {
        var numeroNotifi = document.getElementById('numeroNotifi').value.toUpperCase();
        var endereco = document.getElementById('endereco').value.toUpperCase();
        var bairro = document.getElementById('bairro').value.toUpperCase();
        var proprietario = document.getElementById('proprietario').value.toUpperCase();
        var prazoDias = document.getElementById('numero_dias').value;
        var tipo = tipoSelect.value;
        var foto = document.getElementById('foto').files[0]; // Capturar o arquivo de imagem selecionado
        var numero_proximo = document.getElementById('numero_proximo').value.toUpperCase();
        var nomeArquivo = 'NOTIFICACAO_POSTURA_' + '_NUMERO-CONTROLE_' + numeroNotifi + '.pdf';

        // Verificar se todos os campos estão preenchidos
        if (!numeroNotifi || !endereco || !bairro || !proprietario || !prazoDias) {
            document.getElementById('error-message').textContent = 'Por favor, preencha todos os campos.';
            return;
        }

        // Limpar mensagem de erro
        document.getElementById('error-message').textContent = '';

        // Criar objeto FileReader para ler o conteúdo da imagem
        var reader = new FileReader();
        reader.onload = function(event) {
            var fotoURL = event.target.result; // URL da imagem selecionada
            var conteudoPDF = `
                <div class="pdf" style="display:flex; justify-content: center; align-itens: center; flex-direction: column;">
                    <header style="display:flex; justify-content: center; align-items: center; flex-direction: column; margin: 50px 50px;">
                        <img src="img/logoprefeitura.jpeg" alt="Logo Prefeitura" style="width: 100px; height: 100px;">
                        <h2 style="color:black;">NOTIFICAÇÃO DE POSTURAS ${numeroNotifi}-2024</h2>
                    </header>

                    <section style="margin: 0 65px;">
                        <p>Considerando o teor da Lei Municipal n°2.126/19 (Código de Posturas), a Prefeitura Municipal de São João da Ponte MG NOTIFICA <strong>${proprietario}</strong>,
                            titular de um imóvel na <strong>${endereco}, ${bairro}</strong>,<strong> ${numero_proximo}</strong> nos seguintes termos:
                        </p>
                        <p>
                            ${tipo}
                        </p>
                        <p>
                            Sendo assim, <strong>${proprietario}</strong> fica <strong>CIENTE em reguralizar a situação acima descrita no prazo máximo de ${prazoDias}
                            dias a contar do recebimento deste, caso não cumpra com a notificação, o imóvel esta passivo de MULTA.</strong>
                        </p>
                        <p>
                            Entretanto, fica o notificado ciente que caso reitere a infração verificada ou pratique outras condutas proibidas, poderá ser agravada a penalidade,
                            inclusive com a aplicação de multa e outras sanções descritas no artigo 180 da Lei Municipal n° 2.126/19.
                        </p>
                    </section>

                    <footer style="display:flex; justify-content: center; align-items: center; flex-direction: column; heigh: 100%; width: 100%; padding-bottom: 250px;" >
                        <p>São João da Ponte MG ${new Date().toLocaleDateString()}</p>
                        <p><strong>Data de vencimento:</strong> ${new Date(new Date().getTime() + (prazoDias * 24 * 60 * 60 * 1000)).toLocaleDateString()}</p>
                        <p>_________________________________</p>
                        <p>Lucas Renan Santana Barbosa</p>
                        <p>Fiscal de Posturas</p>
                        <p>Assinatura________________________________ Data de recebimento____/____/____</p>
                    </footer>
                    <div class="img" style="display:flex; justify-content: center; align-items: center; flex-direction: column; heigh: 100%; width: 100%;backgroud-color:green;">
                        <img src="${fotoURL}" alt="Foto" style="width: 600px; max-height: 800px;">
                    </div>
                </div>
            `;

            // Gerar o PDF com os dados da notificação e a imagem
            html2pdf().from(conteudoPDF).set({
                filename: nomeArquivo,
                pagebreak: { mode: 'avoid-all' },
                html2canvas: { scale: 2 }, // Aumenta a escala da captura de tela
                jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' } // Ajusta a qualidade do PDF
            }).save();
        };

        // Ler o conteúdo da imagem como URL de dados
        if (foto) {
            reader.readAsDataURL(foto);
        } else {
            // Caso nenhuma imagem tenha sido selecionada
            reader.onload();
        }
    });
});
