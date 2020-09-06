import {Command, flags} from '@oclif/command'
import { machineNameFlag, ramSizeMBFlag, diskSizeMBFlag, cpuCountFlag } from '@lime.it/blip-core'
import execa = require('execa')
import { VBoxManage } from '../../vbox-manage'

export default class VirtualboxParseCreateArgs extends Command {
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
    const {args, flags} = this.parse(VirtualboxParseCreateArgs)
    
    await VBoxManage.ensurePresent();
    
    const result: any = {
      '--virtualbox-host-dns-resolver': null
    }

    if (flags['ram-size'])
      result['--virtualbox-memory'] = flags['ram-size']

    if (flags['cpu-count'])
      result['--virtualbox-cpu-count'] = flags['cpu-count']

    if (flags['disk-size'])
      result['--virtualbox-disk-size'] = flags['disk-size']

    return result;
  }
}
