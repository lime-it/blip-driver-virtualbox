import {Command, flags} from '@oclif/command'
import execa = require('execa')
import { machineNameFlag, shareHostPathFlag, shareGuestPathFlag } from '@lime.it/blip-core'
import { VBoxManage } from '../../vbox-manage'

export default class VirtualboxAddShare extends Command {
  static hidden = true

  static flags = {
    help: flags.help({char: 'h'}),
    'machine-name': machineNameFlag,
    'share-host-path': shareHostPathFlag,
    'share-guest-path': shareGuestPathFlag
  }

  static args = []

  async run() {
    const {args, flags} = this.parse(VirtualboxAddShare)
    
    await VBoxManage.addSharedFolder(flags['machine-name'], flags['share-guest-path'], flags['share-host-path']);
  }
}
