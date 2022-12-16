import json
import boto3
import json

region_name = "ap-northeast-1"

def lambda_handler(event, context):
    # TODO implement
    ec2_client = boto3.client("ec2", region_name=region_name)
    start_instances(ec2_client, "i-0a45b0f688413b623")
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
def output_boto3(obj):
    json_string = json.dumps(obj, indent=2, default=str)
    print(json_string)


def stop_instances(ec2_client, instanceId):
    # 停止一台 EC2
    response = ec2_client.stop_instances(
        InstanceIds=[
            instanceId,
        ],
        Force=True,
    )
    output_boto3(response)


def start_instances(ec2_client, instanceId):
    # 启动一台 EC2
    response = ec2_client.start_instances(
        InstanceIds=[
            instanceId,
        ],
    )
    output_boto3(response)