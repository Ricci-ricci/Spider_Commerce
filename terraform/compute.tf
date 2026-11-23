resource "aws_instance" "web" {
  ami                    = "ami-0abcdef1234567890"   # LocalStack accepts anything
  instance_type          = "t3.micro"
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  user_data              = file("${path.module}/user_data.sh")

  tags = { Name = "ecommerce-web" }
}

resource "aws_eip" "web" {
  instance = aws_instance.web.id
  domain   = "vpc"
}