import {expect, test} from '@oclif/test'

describe('virtualbox/set-config', () => {
  test
  .stdout()
  .command(['virtualbox/set-config'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['virtualbox/set-config', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
