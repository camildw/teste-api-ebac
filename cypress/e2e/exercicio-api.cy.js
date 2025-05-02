/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {  
  it('Deve validar contrato de usuários', () => {
        cy.request('usuarios').then(response => {
            return contrato.validateAsync(response.body)
        })
    });  

  it('Deve listar usuários cadastrados', () => {
    cy.request({
            method: 'GET',
            url: 'usuarios'
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('usuarios')
            expect(response.duration).to.be.lessThan(20)
        })
  });

  it('Deve cadastrar um usuário com sucesso', () => {  
    let email = `beltrano.${Math.floor(Math.random() * 999)}@ebac.com`
        cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": "Beltrano Silva",
                "email": email,
                "password": "teste123",
                "administrador": "true"
            },
        }).then((response) => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Cadastro realizado com sucesso')
        })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
            method: 'POST',
            url: 'usuarios',
            body: {
                "nome": "Beltrano Silva",
                "email": "beltranosilva@email",
                "password": "teste123",
                "administrador": "true"
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.equal(400)            
        })       
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let email = `beltrano.${Math.floor(Math.random() * 999)}@ebac.com`
    let emaileditado = `fulano1.${Math.floor(Math.random() * 999)}@ebac.com`
        cy.cadastrarUsuario("Beltrano Silva", email, "teste123")
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'PUT', 
                url: `usuarios/${id}`,
                body: 
                {
                    "nome": "Fulano da Silva Editado",
                    "email": emaileditado,
                    "password": "teste1",
                    "administrador": "true"
                  }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
        })
  });

  it('Deve deletar um usuário previamente cadastrado', () => { 
    let email = `beltrano.${Math.floor(Math.random() * 999)}@ebac.com`
        cy.cadastrarUsuario("Beltrano Silva", email, "teste123")
        .then(response => {
            let id = response.body._id

            cy.request({
                method: 'DELETE',
                url: `usuarios/${id}`,                
            }).then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
  });


});
