import {expect, test} from '@oclif/test'

describe('virtualbox/get-config', () => {
  test
  .stdout()
  .command(['virtualbox/get-config'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['virtualbox/get-config', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
