import {expect, test} from '@oclif/test'

describe('virtualbox/remove-share', () => {
  test
  .stdout()
  .command(['virtualbox/remove-share'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['virtualbox/remove-share', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
