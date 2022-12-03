import json
import boto3
import logging

logging.basicConfig(level=logging.INFO)
client = boto3.client('elasticache')


def lambda_handler(event, context):
    # TODO implement
    response = client.delete_replication_group(
        ReplicationGroupId='miaosha',
        RetainPrimaryCluster=False
    )
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
