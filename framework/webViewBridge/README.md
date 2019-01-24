# webViewBridge 备胎通用hybird通信桥

## version v1.1 版本修改：


## 规范约定
> 如果当前定义方法跟base相冲突，可在index中进行重写（除非逻辑有问题，否则尽量不要直接修改或添加到base里头，base应该包含的是最通用的实现）

###base中废弃的方法：

 - takeScreenshot
>方法说明：截屏事件监听
>废除原因：已经改成由js注册到window对象中一个takeScreenshot，方法由app在监听到截屏事件后主动来调用js的方法。

 - 范德萨发

### 需要手动移植出来的方法
- 下个版本再整理，否则怕影响太多
