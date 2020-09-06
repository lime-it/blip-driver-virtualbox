import {expect, test} from '@oclif/test'

describe('virtualbox/parse-create-args', () => {
  test
  .stdout()
  .command(['virtualbox/parse-create-args'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['virtualbox/parse-create-args', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
