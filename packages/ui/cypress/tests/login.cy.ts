import { injectedAccounts } from '../fixtures/injectedAccounts'
import { landingPageUrl } from '../fixtures/landingData'
import { landingPage } from '../support/page-objects/landingPage'

describe('Connect Account', () => {
  beforeEach(() => {
    cy.visit(landingPageUrl)
  })

  it('Reject connection', () => {
    cy.initExtension(injectedAccounts)
    landingPage.connectButton().click()
    cy.getAuthRequests().then((re) => {
      const requests = Object.values(re)
      // we should have 1 connection request to the extension
      cy.wrap(requests.length).should('eq', 1)
      // this request should be from the application Multix
      cy.wrap(requests[0].origin).should('eq', 'Multix')
      // let's allow it for Alice
      cy.rejectAuth(requests[0].id, 'Cancelled')
      // the ui should then move on to connecting to the rpcs
      cy.get('[data-cy="text-no-account-found"]').should('contain', 'No account found')
    })
  })

  it('Connects with Alice', () => {
    cy.initExtension(injectedAccounts)
    landingPage.connectButton().click()
    cy.getAuthRequests().then((re) => {
      const requests = Object.values(re)
      // we should have 1 connection request to the extension
      cy.wrap(requests.length).should('eq', 1)
      // this request should be from the application Multix
      cy.wrap(requests[0].origin).should('eq', 'Multix')
      // let's allow it for Alice
      cy.enableAuth(requests[0].id, [Object.values(injectedAccounts)[0].address])
      // the ui should then move on to connecting to the rpcs
      cy.get('[data-cy="loader-rpc-connection"]').should('contain', 'Connecting to the node at')
    })
  })
})