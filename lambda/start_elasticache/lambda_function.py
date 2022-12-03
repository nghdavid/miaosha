import json
import boto3
import logging
logging.basicConfig(level=logging.INFO)
client = boto3.client('elasticache')


def lambda_handler(event, context):
    # TODO implement

    # Creates a cluster mode enabled
    response = create_cluster_mode_enabled(
        CacheNodeType='cache.t2.micro',
        EngineVersion='7.0',
        ReplicationGroupDescription='Redis cluster mode enabled with replicas',
        ReplicationGroupId='miaosha',
        #   Creates a cluster mode enabled cluster with 1 shard(NumNodeGroups), 1 primary (implicit) and 2 replicas (replicasPerNodeGroup)
        NumNodeGroups=2,
        ReplicasPerNodeGroup=0,
    )
    logging.info(response)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


def create_cluster_mode_enabled(CacheNodeType='cache.t2.micro', EngineVersion='7.0', NumNodeGroups=1, ReplicasPerNodeGroup=1, ReplicationGroupDescription='Sample cache with cluster mode enabled', ReplicationGroupId=None):
    """Creates an Elasticache Cluster with cluster mode enabled

    Returns a dictionary with the API response

    :param CacheNodeType: Node type used on the cluster. If not specified, cache.t3.small will be used
    Refer to https://docs..amazon.com/AmazonElastiCache/latest/red-ug/CacheNodes.SupportedTypes.html for supported node types
    :param EngineVersion: Engine version to be used. If not specified, latest will be used.
    :param NumNodeGroups: Number of shards in the cluster. Minimum 1 and maximun 90.
    If not specified, cluster will be created with 1 shard.
    :param ReplicasPerNodeGroup: Number of replicas per shard. If not specified 1 replica per shard will be created.
    :param ReplicationGroupDescription: Description for the cluster.
    :param ReplicationGroupId: Name for the cluster
    :return: dictionary with the API results

    """
    if not ReplicationGroupId:
        return 'ReplicationGroupId parameter is required'

    response = client.create_replication_group(
        AutomaticFailoverEnabled=True,
        CacheNodeType=CacheNodeType,
        Engine='redis',
        EngineVersion=EngineVersion,
        ReplicationGroupDescription=ReplicationGroupDescription,
        ReplicationGroupId=ReplicationGroupId,
        #   Creates a cluster mode enabled cluster with 1 shard(NumNodeGroups), 1 primary node (implicit) and 2 replicas (replicasPerNodeGroup)
        NumNodeGroups=NumNodeGroups,
        ReplicasPerNodeGroup=ReplicasPerNodeGroup,
        SecurityGroupIds=[
            'sg-01d5339b054769bdb',
        ],
        CacheParameterGroupName='default.redis7.cluster.on'
    )

    return response
