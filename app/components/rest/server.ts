/// <reference path="../../../typings/tsd.d.ts" />

export class ServerService {
    config: Array<any>;
    rest: restangular.ICollection;
    static $inject: Array<string> = ['Restangular'];
    constructor(rest:restangular.ICollection) {
        this.rest = rest;
    }

    // **getList**
    // **@returns** a promise with all servers.
    getList() {
        return this.rest.all('hosts').getList().then(function(servers) {
            return servers;
        });
    }

    // **getListByCluster**
    // **@returns** a promise with all servers.
    getListByCluster(clusterId) {
        return this.rest.one('clusters', clusterId).all('hosts').getList().then(function(servers) {
            return servers;
        });
    }

    // **getFreeHosts**
    // **@returns** a promise with all servers which are free.
    getFreeHosts() {
        return this.rest.all('hosts').getList().then(function(servers) {
            return _.filter(servers, function(server) {
                return _.isNull(server.cluster);
            });
        });
    }

    // **getDiscoveredHosts**
    // **@returns** a promise with all servers discovered.
    getDiscoveredHosts() {
        return this.rest.all('discovered-hosts').getList().then(function(servers) {
            return servers;
        });
    }

    // **get**
    // **@returns** a promise with this specific server's metadata.
    get(id) {
        return this.rest.one('hosts', id).get().then(function(server) {
            return server;
        });
    }

    // **getByHostname**
    // **@returns** a promise with this specific server's metadata.
    getByHostname(hostname) {
        return this.getList().then(function(servers) {
            return _.find(servers, function(server) {
                return server.node_name === hostname;
            });
        });
    }

    // **add**
    // **@returns** a promise with the request id for the operation.
    add(host) {
        return this.rest.all('hosts').post(host);
    }

    // **remove**
    // **@param** id - id of server you wish to remove.
    // **@returns** a promise with the request id for the operation.
    remove(id) {
        return this.rest.one('hosts', id).remove();
    }

    // **getGrains**
    // **@returns** a promise with the metadata, key value pairs associated with
    // this specific server, aka grains in Salt Stack parlance.
    // **@see** http://docs.saltstack.com/en/latest/topics/targeting/grains.html
    getGrains(id) {
        return this.rest.one('server', id).one('grains').get().then(function(server) {
            return server;
        });
    }

    // **getStorageDevices**
    // **@returns** a promise with all storage devices in the server.
    getStorageDevices(hostId) {
        return this.rest.one('hosts', hostId).all('storage-devices').getList().then(function(devices) {
            return devices;
        });
    }

    // **getDiskStorageDevices**
    // **@returns** a promise with all storage devices in the server.
    getDiskStorageDevices(hostId) {
        return this.rest.one('hosts', hostId).all('storage-devices').getList().then(function(devices) {
            return _.filter(devices, function(device) {
                return device.device_type === 'disk';
            });
        });
    }
   
    // **getStorageDevicesFree**
    // **@returns** a promise with all storage devices which are not being used in the server.
    getStorageDevicesFree(hostId, hostname) {
        return this.getStorageDevices(hostId).then(function(devices){
            if(hostname) {
                _.each(devices, function(device){
                    device.hostname = hostname;
                });
            }
            return _.filter(devices, function(device) {
                return device.inuse === false && device.device_type === 'disk';
            });
        });
    }

}
