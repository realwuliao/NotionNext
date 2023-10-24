import React, { useEffect, useState } from 'react';
import * as PIXI from 'pixi.js'
export default function Live2D() {
  const modelUrl = 'https://xxx.tgftgf.workers.dev/103302/model.json';
  const [modelData, setModelData] = useState(null);

  useEffect(() => {
    // 使用 Fetch API 从网络链接获取 Live2D 模型资源
    fetch(modelUrl)
      .then((response) => response.json()) // 或者使用适当的解析方法
      .then((data) => {
        // 数据加载成功后，设置模型数据
        setModelData(data);
      })
      .catch((error) => {
        console.error('加载模型资源失败', error);
      });
  }, [modelUrl]);

  useEffect(() => {
    if (modelData) {
      // 创建 Live2D 模型
      const settings = new PIXI.live2d.Cubism4ModelSettings(modelData);
      const live2dSprite = PIXI.live2d.Live2DModel.from(settings, {
        eyeBlink: true,
        lipSyncWithSound: true,
        debugLog: false,
        debugMouseLog: false,
        randomMotion: false,
        defaultMotionGroup: 'Motion',
        autoInteract: follow,
        expressionFadingDuration: 0,
        motionFadingDuration: 0,
        idleMotionFadingDuration: 0,
      });

      // 创建 Pixi Application
      const app = new PIXI.Application({
        width: 1800,
        height: 1800,
        transparent: true,
        preserveDrawingBuffer: true
      });

      // 将 Live2D 模型添加到 Pixi Application 的舞台
      app.stage.addChild(live2dSprite);
      live2dSprite.scale.set(0.5, 0.5);

      // 点击事件处理
      function handleModelClick() {
        // 随机切换表情
        live2dSprite.internalModel.motionManager.expressionManager.setRandomExpression();

        // 随机切换动作
        live2dSprite.internalModel.motionManager.startRandomMotion('Motion');
      }

      // 将点击事件处理函数绑定到 Live2D 模型
      live2dSprite.on('click', handleModelClick);

      // 将 Pixi Application 挂载到页面上的 DOM 元素
      const container = document.getElementById('live2d-container');
      container.style.width = '900px';
      container.style.height = '900px';
      container.appendChild(app.view);
    }
  }, [modelData]);

  return <div id='live2d-container' style={{ width: '900px', height: '900px' }}></div>;
}
