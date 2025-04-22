---
title: block IO와 non-block IO
categories: [OS]
date: 2023-02-12 09:00:00 +0900
tags: [CS]
---

# IO의 종류
- network(socket)
- file
- pipe(process 간 통신)
- device

# socket
- 네트워크 통신은 `socket`을 통해 데이터가 주고받아짐
- 통신하고자 하는 두 프로세스는 각 소켓을 열고 이를통하여 통신
![Image](https://github.com/user-attachments/assets/050fa40f-a955-496d-a025-b00dc46f8c08)

# 스레드에서 blocking IO
![Image](https://github.com/user-attachments/assets/22a2b3fa-db98-4249-89f8-9004eaa1157b)
스레드에서 blocking system call을 호출하면 해당 IO 작업이 완료될 때까지 스레드는 대기  
커널은 작업이 완료되어야 결과를 리턴
> 스레드는 IO가 발생하면 waiting 상태로 전환됨  
> 즉, blocking이 되어도 CPU는 계속 일하고 있지만  
> IO 작업이 완료되기 전까지 waiting이므로 다른 스레드와의 CPU 사용 경쟁에서 불리함

# 소켓에서 blocking IO
- 소켓 A는 데이터를 받는 입장
- 소켓 S는 데이터를 전송하는 입장
![Image](https://github.com/user-attachments/assets/5882296f-d707-49d3-8435-4b36a7fe9d49)
`raed(socket A)`를 호출 시 `recv_buffer`가 비어져 있으면 데이터가 올때까지 대기 => blocking  
`write(socket S)`를 호출 시 `send_buffer`가 가득 차있으면 자리가 생길때까지 대기 => blocking  

# 스레드에서 non-blocking IO
![Image](https://github.com/user-attachments/assets/18f4830a-d747-4499-8dd4-7d6bd8e21ae5)
non-blocking system call을 호출하면 커널은 IO 작업 완료 전 결과를 즉시 리턴  
스레드는 다른 작업을 계속 진행할 수 있음
> non-blocking은 IO가 발생하여도 스레드는 waiting 상태로 전환되지 않음  
> 스레드는 커널에 작업이 완료되었는지 주기적으로 확인하거나  
> 완료되면 커널에게 알림을 받아 결과를 처리하는 2가지 방식 존재

# 소켓에서 non-blocking IO
![Image](https://github.com/user-attachments/assets/6e423402-5118-4c0a-a628-f2c9d4b8efe6)
스레드의 non-blocking IO와 마찬가지로 `read`, `write` 호출 시 커널은 즉시 결과를 리턴  

# IO 멀티플렉싱
- IO 작업들을 동시에 system call로 요청하고 완료된 작업들을 한번에 알려줌줌
![Image](https://github.com/user-attachments/assets/a169fc7c-72ea-41a6-815a-e4c25ab016c5)
2개 소켓의 `non-blocking read`를 한번의 `system call`로 호출
알려줄 때도 한번에 2개의 작업에 대해 완료 여부 및 결과를 알려줌
> 위에서는 blocked 된 스레드로 그려졌지만  
> 스레드가 run/blocked 될지는 상황, 구현에 따라 다름  
> 즉, IO 멀티플렉싱은 스레드가 block, non-block과 관계없이 한번에 여러 요청을 커널에 전달, 결과를 받는 것이 핵심

## IO 멀티플렉싱의 종류
- select
- poll
- epoll(Linux)
- kqueue(Mac OS)
- IOCP(Windows)
