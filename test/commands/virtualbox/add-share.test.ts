import {expect, test} from '@oclif/test'

describe('virtualbox/add-share', () => {
  test
  .stdout()
  .command(['virtualbox/add-share'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['virtualbox/add-share', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
