import execa = require('execa');
import { CLIError } from '@oclif/errors';
import { ToolingDependecy, BlipMachineConfiguration, BlipMachineShareFolderInfo } from '@lime.it/blip-core';

export abstract class VBoxManageTool extends ToolingDependecy{
  abstract getConfiguration(vmName:string):Promise<BlipMachineConfiguration>
  abstract setConfiguration(vmName:string, configuration:Partial<BlipMachineConfiguration>):Promise<void>;

  abstract addSharedFolder(vmName:string, guestPath:string, hostPath: string):Promise<void>;
  abstract removeSharedFolder(vmName:string, guestPath:string):Promise<void>;
}

class VBoxManageToolImpl extends VBoxManageTool {

  private findDiskPath(lines:string[]):string{
    return (lines.find(p => /\.vmdk"$|\.vdi"$/.test(p))?.split('=')[1] as string)
  }

  async isPresent(): Promise<boolean> {
    const {exitCode} = await execa('vboxmanage', ['-v']);
    return exitCode == 0;
  }
  protected toolMissingMessage():string{
    return `VBoxManage is missing from the current environment. Please check https://www.virtualbox.org/wiki/Downloads`;
  }

  async getConfiguration(vmName: string): Promise<BlipMachineConfiguration> {
    await this.ensurePresent();

    const mrStdout = (await execa('VBoxManage', ['showvminfo', vmName, '--machinereadable'])).stdout;

    const tuples = mrStdout.split('\n').map(p => p.replace('\r', '').replace('\n', ''))

    const diskPath = this.findDiskPath(tuples);

    const diskInfoStdout = (await execa('VBoxManage', ['showmediuminfo', diskPath.replace(/"/g, '')])).stdout;
    const diskSize = /\d+/.exec(diskInfoStdout.split('\n').find(p => p.startsWith('Capacity')) || '')

    const sharedStdout = (await execa('VBoxManage', ['showvminfo', vmName])).stdout;

    const lines = sharedStdout.split('\n').map(p => p.replace('\r', '').replace('\n', ''))

    const shareLineIdx = lines.findIndex(p => p.startsWith('Shared folders:') && !p.endsWith('<none>'))
    let shares:{ [key:string]: BlipMachineShareFolderInfo } = {};
    if (shareLineIdx >= 0){
      const sharesLines = lines.slice(shareLineIdx + 2, shareLineIdx + 2 + lines.slice(shareLineIdx + 2).findIndex(p => p.trim().length === 0))
  
      shares = sharesLines.map(line => {
        const props = line.split(',').map(p => p.trim())
  
        return {
          name: props.find(p => p.startsWith('Name:'))?.replace(/^Name:\s*/, '')?.replace(/^'(.*)'$/, '$1') || '',
          hostPath: props.find(p => p.startsWith('Host path:'))?.replace(/^Host path:\s*/, '')?.replace(/^'(.*)'.+$/, '$1') || '',
          guestPath: props.find(p => p.startsWith('mount-point:'))?.replace(/^mount-point:\s*/, '')?.replace(/^'(.*)'$/, '$1') || '',
        }
      }).reduce((acc, p)=>{acc[p.name]={hostPath:p.hostPath}; return acc;}, {} as { [key:string]: BlipMachineShareFolderInfo });
    }

    return {
      cpuCount: parseInt(tuples.find(p => p.startsWith('cpus='))?.replace('cpus=', '') || '1', 10),
      ramMB: parseInt(tuples.find(p => p.startsWith('memory='))?.replace('memory=', '') || '1', 10),
      diskMB: parseInt(diskSize ? diskSize[0] : '0', 10),
      sharedFolders: shares
    }
  }

  async setConfiguration(vmName: string, configuration: Partial<BlipMachineConfiguration>): Promise<void> {
    await this.ensurePresent();

    const currentConf = await this.getConfiguration(vmName);

    if (configuration.diskMB && configuration.diskMB!=currentConf.diskMB) {
      const {stdout} = await execa('VBoxManage', ['showvminfo', vmName, '--machinereadable'])

      const tuples = stdout.split('\n').map(p => p.replace('\r', '').replace('\n', ''))

      const diskPath = this.findDiskPath(tuples);

      let {exitCode} = await execa('VBoxManage', ['modifymedium', diskPath.replace(/"/g, ''), '--resize', configuration.diskMB.toString()]);
      if(exitCode!=0)
        throw new Error(`Disk resize fail: exitCode: ${exitCode}`)
    }

    const params = []

    if (configuration.cpuCount && configuration.cpuCount!=currentConf.cpuCount) {
      params.push('--cpus')
      params.push(configuration.cpuCount.toString())
    }
    if (configuration.ramMB && configuration.ramMB!=currentConf.ramMB) {
      params.push('--memory')
      params.push(configuration.ramMB.toString())
    }
    if (configuration.group){
      params.push('--groups')
      params.push(configuration.group.toString())
    }

    if (params.length > 0){
      let {exitCode} = await execa('VBoxManage', ['modifyvm', vmName, ...params])
      if(exitCode!=0)
        throw new Error(`Disk resize fail: exitCode: ${exitCode}`)
    }
  }

  async addSharedFolder(vmName: string, guestPath: string, hostPath: string): Promise<void> {
    await this.ensurePresent();

    await execa('VBoxManage', [
      'sharedfolder', 'add', vmName,
      '--name', guestPath,
      '--hostpath', hostPath,
      '--automount',
      '--auto-mount-point', guestPath])
  }
  async removeSharedFolder(vmName: string, guestPath: string): Promise<void> {
    await this.ensurePresent();
    
    await execa('VBoxManage', ['sharedfolder', 'remove', vmName, '--name', guestPath])
  }
}

export const VBoxManage:VBoxManageTool = new VBoxManageToolImpl();