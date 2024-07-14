describe('TechGlobal Student APIs', () => {
  let studentId
  const postRequestBody = {
    DOB: '1974-07-28',
    EMAIL: 'Sterling.Brakus30@hotmail.com',
    FIRST_NAME: 'Oran',
    LAST_NAME: 'Walsh',
    INSTRUCTOR_ID: 4,
  }

  it('TASK-1: Get All Students', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('TG_STUDENTS_URL')}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.length).to.be.gte(2)
      response.body.forEach((student) => {
        expect(student).to.have.property('STUDENT_ID')
      })
    })
  })

  it('TASK-2: Create a New Student', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('TG_STUDENTS_URL')}`,
      body: postRequestBody,
    }).then((response) => {
      expect(response.status).to.eq(201)
      studentId = response.body.STUDENT_ID
      expect(response.body.STUDENT_ID).to.be.greaterThan(2)
      Object.entries(postRequestBody).forEach(([key, value]) => {
        expect(response.body[key]).to.equal(value)
      })
    })
  })

  it('TASK-3: Get Newly Created Student', () => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('TG_STUDENTS_URL')}/${studentId}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.be.an('object')
      Object.entries(postRequestBody).forEach(([key, value]) => {
        if (key === 'DOB') expect(response.body[key]).to.contain(value)
        else expect(response.body[key]).to.equal(value)
      })
    })
  })

  it('TASK-4: Update Newly Created Student with a Different Instructor', () => {
    const putRequestBody = {
      DOB: '1974-07-28',
      EMAIL: 'Sterling.Brakus30@hotmail.com',
      FIRST_NAME: 'Oran',
      LAST_NAME: 'Walsh',
      INSTRUCTOR_ID: 3,
    }

    cy.request({
      method: 'PUT',
      url: `${Cypress.env('TG_STUDENTS_URL')}/${studentId}`,
      body: putRequestBody,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body).to.eq(`Successfully updated ${putRequestBody.FIRST_NAME}`)
    })
  })

  it('TASK-5: Delete Newly Created Student', () => {
    cy.request({
      method: 'DELETE',
      url: `${Cypress.env('TG_STUDENTS_URL')}/${studentId}`,
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.message).to.eq(`Successfully deleted user with Id: ${studentId}`)
    })
  })
})
