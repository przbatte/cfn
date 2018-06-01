var should = require('should')
require('should-sinon')

should.Assertion.add(
    'calledWithCFStackParams',

    /**
     *
     * @param expectedStackName {String}
     * @param expectedCapabilities {String[]}
     * @param expectedRenderedTemplate {Object}
     * @param expectedS3Template {String}
     */
    function (expectedStackName, expectedCapabilities, expectedRenderedTemplate, expectedS3Template) {
        // assertion can only be called on a stub but should-sinon will take care of that check
      var stackSpy = this.obj
      stackSpy.should.be.calledOnce()

        // wait to define these error messages to allow should-sinon to display their messages in case
      var templateMessage = expectedRenderedTemplate ? 'and rendered template body: ' + JSON.stringify(expectedRenderedTemplate) : 'and template s3 uri' + expectedS3Template
        // sinon spy assertion fails
      this.params = {
        operator: 'to create/update stack ' + expectedStackName + ' with capabilities ' + expectedCapabilities + templateMessage,
        showDiff: true
      }

      // update should have js template stack name
      var stackSpyCallArgs = stackSpy.firstCall.args[0]
      should.exist(stackSpyCallArgs)

      stackSpyCallArgs.should.have.property('StackName', expectedStackName)
      stackSpyCallArgs.should.have.property('Capabilities')
      stackSpyCallArgs.Capabilities.should.be.an.Array()
      stackSpyCallArgs.Capabilities.should.be.eql(expectedCapabilities)

      // check that template is the same as expected object
      if (expectedRenderedTemplate) {
        stackSpyCallArgs.should.have.property('TemplateBody')
        var requestedTemplate = JSON.parse(stackSpyCallArgs.TemplateBody)
        requestedTemplate.should.be.eql(expectedRenderedTemplate)
      } else {
        stackSpyCallArgs.should.have.property('TemplateURL')
        stackSpyCallArgs.TemplateURL.should.be.eql(expectedS3Template)
      }
    },

    // not a getter
    false
)
