import React, { useEffect, useState } from 'react';
import { loadExternalResource } from '@/lib/utils';

export default function Live2D() {
  const modelUrl = 'https://xxx.tgftgf.workers.dev/103302/model.json';
  const [modelData, setModelData] = useState(null);
  const follow = true;
  let live2dSprite;

  useEffect(() => {
    // 使用 Fetch API 从网络链接获取 Live2D 模型资源
    fetch(modelUrl)
      .then((response) => response.json())
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
      loadPixiJSAndInitializeLive2D();
    }
  }, [modelData]);

  // 使用 loadExternalResource 加载 PixiJS
  const loadPixiJSAndInitializeLive2D = () => {
    loadExternalResource('https://pixijs.download/v7.3.2/pixi.min.js', 'js')
      .then(() => {
        // 导入 PixiJS 对象
        import('pixi.js').then((PIXI) => {
          // 创建 Pixi Application
          const app = new PIXI.Application({
            width: 1280,
            height: 1600,
            transparent: true,
            preserveDrawingBuffer: true,
          });

          // 创建 Live2D 模型
          const settings = new PIXI.live2d.Cubism4ModelSettings(modelData);
          live2dSprite = PIXI.live2d.Live2DModel.from(settings, {
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
          container.style.width = '320px';
          container.style.height = '400px';
          container.appendChild(app.view);
        });
      })
      .catch((error) => {
        console.error('加载 PixiJS 失败', error);
      });
  };

  return <div id='live2d-container' style={{ width: '320px', height: '400px' }}></div>;
}
