# A
所有当前系统正在运行的docker

所有配置文件已知的服务

去掉重复部分（以docker为准）

每一项，映射服务的名字到：
 * 如果是本机运行的docker：docker容器的ip
 * 如果是外部服务：负载均衡nginx
 * 如果是本机应该有的服务，但没有：负载均衡nginx



# B
负载均衡nginx的IP：
 * 如果当前系统有nginx在运行，就是本机 127.0.0.1
 * 否则，按照配置找到上级负载均衡ip


# C
映射网络中所有机器ID到它的ip
