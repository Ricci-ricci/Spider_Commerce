output "vpc_id"      { value = aws_vpc.main.id }
output "ec2_id"      { value = aws_instance.web.id }
output "public_ip"   { value = aws_eip.web.public_ip }
output "bucket"      { value = aws_s3_bucket.assets.bucket }