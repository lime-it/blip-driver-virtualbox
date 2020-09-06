import {Command, flags} from '@oclif/command'
import { machineNameFlag, cpuCountFlag, ramSizeMBFlag, diskSizeMBFlag } from '@lime.it/blip-core'
import execa = require('execa')
import { VBoxManage } from '../../vbox-manage'

export default class VirtualboxSetConfig extends Command {
  static hidden = true

  static flags = {
    help: flags.help({char: 'h'}),
    'machine-name': machineNameFlag,
    'cpu-count': cpuCountFlag,
    'ram-size': ramSizeMBFlag,
    'disk-size': diskSizeMBFlag
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(VirtualboxSetConfig)

    await VBoxManage.setConfiguration(flags['machine-name'], {
      group: '/blip',
      cpuCount: flags['cpu-count'],
      ramMB: flags['ram-size'],
      diskMB: flags['disk-size']
    });
  }
}
