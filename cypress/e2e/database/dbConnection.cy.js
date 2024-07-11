describe('DBConnection', () => {
  it('Runs a query', () => {
    cy.task('runQuery', 'SELECT * FROM students').then((rows) => {
      console.log(JSON.stringify(rows, null, 2))

      expect(rows).to.have.length.above(2)
      cy.wrap(rows).should('have.length.above', 2)
    })
  })
})
