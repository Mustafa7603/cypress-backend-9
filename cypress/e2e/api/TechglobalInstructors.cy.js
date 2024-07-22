let newstudentID
describe('TechGlobal Student-Instructor APIs', () => {
  const postRequestBody = {
    DOB: '1974-07-28',
    EMAIL: 'Sterling.Brakus30@hotmail.com',
    FIRST_NAME: 'burak',
    LAST_NAME: 'Latif',
    INSTRUCTOR_ID: 4,
  }
  const instrId = postRequestBody.INSTRUCTOR_ID

  it('TASK-1: Get All Instructors', () => {
    cy.request({
      method: 'GET',
      url: Cypress.env('TG_INSTR_URL'),
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.length).to.be.eq(4)
      response.body.forEach((Instructor, index) => {
        expect(Instructor).to.have.property('INSTRUCTOR_ID')
        expect(Instructor).to.have.property('FULLNAME')
        expect(Instructor).to.have.property('STUDENTS')
        expect(Instructor.INSTRUCTOR_ID).to.eq(index + 1)
      })
    })
  })

  it('TASK-2: Get A Single Instructor', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('TG_INSTR_URL')}/${instrId}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      const Instructor = response.body
      expect(Instructor).to.have.property('FULLNAME')
      expect(Instructor).to.have.property('STUDENTS')
      expect(Instructor.STUDENTS).to.be.an('array')
      expect(Instructor.INSTRUCTOR_ID).to.eq(instrId)
    })
  })

  it('TASK-3: Create a New Student and Validate the Instructor', () => {
    cy.request({
      method: 'POST',
      url: Cypress.env('TG_STUDENTS_URL'),
      body: postRequestBody,
    }).then((response) => {
      expect(response.status).to.eq(201)
      newstudentID = response.body.STUDENT_ID

      cy.request({
        method: 'GET',
        url: `${Cypress.env('TG_INSTR_URL')}/${instrId}`,
      }).then((response) => {
        expect(response.status).to.eq(200)
        const Instructor = response.body
        expect(Instructor).to.have.property('FULLNAME')
        expect(Instructor).to.have.property('STUDENTS')

        expect(Instructor.STUDENTS).to.be.an('array')
        expect(Instructor.INSTRUCTOR_ID).to.eq(instrId)

        // Delete the student after validating the instructor
        cy.request({
          method: 'DELETE',
          url: `${Cypress.env('TG_STUDENTS_URL')}/${newstudentID}`,
        }).then((response) => {
          expect(response.status).to.eq(204)
        })
      })
    })
  })
})
