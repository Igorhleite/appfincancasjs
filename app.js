class Despesa {  //criando a classe despesa
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
      }
    validarDados() { //validando se os campos estão preenchidos
        for(let i in this){
            //console.log(i, this[i])
                if(this[i] === undefined || this[i] === '' || this[i] == null){
                    return false
                }
        }
        return true
      }
    }

class Bd { //OBJETO BD

    constructor() {
        let id = localStorage.getItem('id')

        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId(){
         let proximoId = localStorage.getItem('id')
         return parseInt(proximoId) + 1 
    }
    gravar(d){ // gravando despesas no localstorage
        let id = this.getProximoId()
        localStorage.setItem(id, JSON.stringify(d)) //convertendo literal -> JSON
        localStorage.setItem('id', id)
    }
    recuperarTodosRegistros() { // RECUPERAR REGISTROS NO LOCAL STORAGE
        let despesas = Array() //array para recuperação dos dados

        let id = localStorage.getItem('id')
        
        for(let i = 1; i <= id; i++){

            //recuperar as despesas (JSON->obj literal)
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //indices não existem (pula)            
            if(despesa === null){
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }// FIM RECUPERAR REGISTROS NO LOCAL STORAGE

    pesquisar(despesa) { // PESQUISAR NO LOCAL STORAGE (RECEBE UM ARRAY DESPESA E FAZ A COMPARAÇÃO)

        let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descri
        if(despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }
        return despesasFiltradas
    } // FIM PESQUISAR NO LOCAL STORAGE (RETORNA DESPESASFILTRADAS)


    remover(id) { //REMOVE A DESPESA A PARTIR DO SEU ID
        localStorage.removeItem(id)
    }
}


let bd = new Bd()


function cadastrarDespesa(){ //FUNÇÃO CADASTRAR DESPESAS
    
                        let ano = document.getElementById('ano')
                        let mes = document.getElementById('mes')
                        let dia = document.getElementById('dia')
                        let tipo = document.getElementById('tipo')
                        let descricao = document.getElementById('descricao')
                        let valor = document.getElementById('valor')
                    
                        let despesa = new Despesa(
                            ano.value,
                            mes.value,
                            dia.value,
                            tipo.value,
                            descricao.value,
                            valor.value
                        )
                        if(despesa.validarDados()){ //CASO SUCESSO GRAVAÇÃO (MUDANDO PARAMETROS NO DIALOG GERADO EM INDEX.HTML)
                            bd.gravar(despesa)
                            document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!'
                            document.getElementById('modal_titulodiv').className = 'modal-header text-success'
                            document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
                            document.getElementById('modal_btn').className = 'btn btn-success'


                            $('#Gravacao').modal('show') //DEIXANDO CAMPOS VAZIOS APÓS GRAVAÇÃO

                                ano.value = ''
                                mes.value = ''
                                dia.value = ''
                                tipo.value = ''
                                descricao.value = ''
                                valor.value = ''
                        
                        } else { //CASO ERRO GRAVAÇÃO (MUDANDO PARAMETROS NO DIALOG GERADO EM INDEX.HTML)

                            document.getElementById('modal_titulo').innerHTML = 'Erro na Gravação'
                            document.getElementById('modal_titulodiv').className = 'modal-header text-danger'
                            document.getElementById('modal_conteudo').innerHTML = 'Existem campos obrigatórios vazios!'
                            document.getElementById('modal_btn').className = 'btn btn-danger'

                            $('#Gravacao').modal('show')
                        }
                    }

        function carregaListaDespesas() { //FUNÇÃO CARREGAR LISTA DE DESPESAS (ATIVA QUANDO A PÁGINA CONSULTA.HTML É ABERTA)

                    let despesas = Array()

                    despesas = bd.recuperarTodosRegistros()
                    
                    let listaDespesas = document.getElementById('listaDespesas')
                        
                    despesas.forEach(function(d) {
                        let linha = listaDespesas.insertRow()

                        linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano
                                // arrumando as o tipo de despesa
                        switch(d.tipo) {
                                case '1': d.tipo = 'Alimentação'
                                    break
                                case '2': d.tipo = 'Educação'
                                    break
                                case '3': d.tipo = 'Lazer'
                                    break
                                case '4': d.tipo = 'Saúde'
                                    break
                                case '5': d.tipo = 'Transporte'
                                    break
                        }
                        linha.insertCell(1).innerHTML = d.tipo
                        linha.insertCell(2).innerHTML = d.descricao
                        linha.insertCell(3).innerHTML = d.valor

                        let btn = document.createElement("button")
                        btn.className = 'btn btn-danger'
                        btn.innerHTML = '<i class="fas fa-times"> </i>'
                        btn.id = 'id_despesa' + d.id
                        btn.onclick = function(){
                            
                            let id = this.id.replace ('id_despesa', '')
                            bd.remover(id)

                            window.location.reload()
                        }
                        linha.insertCell(4).append(btn)
                    })

}

    function pesquisarDespesa() { //função para pesquisar as depesas
            let ano = document.getElementById('ano').value
            let mes = document.getElementById('mes').value
            let dia = document.getElementById('dia').value
            let tipo = document.getElementById('tipo').value
            let descricao = document.getElementById('descricao').value
            let valor = document.getElementById('valor').value

            let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor) //variavel a ser "filtrada no db.pesqusiar"

            let despesas = bd.pesquisar(despesa) //variavel que recebe as despesas filtradas do objeto db.pesquisar

            let listaDespesas = document.getElementById('listaDespesas') // preenchendo as linhas e colunas com as despesas pesquisadas
            listaDespesas.innerHTML = '' //limpando o tbody antes de preencher com elementos pesquisados
                
            despesas.forEach(function(d) {
                let linha = listaDespesas.insertRow()

                linha.insertCell(0).innerHTML = d.dia + '/' + d.mes + '/' + d.ano
                        // arrumando as o tipo de despesa
                switch(d.tipo) {
                        case '1': d.tipo = 'Alimentação'
                            break
                        case '2': d.tipo = 'Educação'
                            break
                        case '3': d.tipo = 'Lazer'
                            break
                        case '4': d.tipo = 'Saúde'
                            break
                        case '5': d.tipo = 'Transporte'
                            break
                }
                linha.insertCell(1).innerHTML = d.tipo
                linha.insertCell(2).innerHTML = d.descricao
                linha.insertCell(3).innerHTML = d.valor
            })
        
    }


