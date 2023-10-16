/* eslint-disable no-undef */
import BLOG from '@/blog.config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import React, { useEffect, useState } from 'react';

export default function Live2D() {
  const { theme, switchTheme } = useGlobal();
  const showPet = JSON.parse(BLOG.WIDGET_PET);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const poseData = require('./pose.json'); // 引入pose.json文件
  const physicsData = require('./physics.json'); // 引入physics.json文件

  useEffect(() => {
    if (showPet) {
      Promise.all([
        loadExternalResource('https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/live2d.min.js', 'js')
      ]).then((e) => {
        if (typeof window?.loadlive2d !== 'undefined') {
          // 加载模型
          try {
            loadlive2d('live2d', BLOG.WIDGET_PET_LINK);
          } catch (error) {
            console.error('读取PET模型', error);
          }
        }
      });
    }
  }, [theme]);

  // 处理姿势切换的函数
  function applyPose(poseIndex) {
    const selectedPose = poseData[poseIndex];
    // 在这里使用Live2D库的函数来应用姿势
    // 示例：假设使用setPose函数来应用姿势
    setPose(selectedPose);

    // 如果有物理特性的数据，也可以应用
    if (physicsData) {
      // 在这里使用Live2D库的函数来应用物理特性
      // 示例：假设使用setPhysics函数来应用物理特性
      setPhysics(physicsData);
    }
  }

  // 处理点击事件，切换到下一个姿势
  function handleClick() {
    if (JSON.parse(BLOG.WIDGET_PET_SWITCH_THEME)) {
      switchTheme();
    } else {
      const nextPoseIndex = (currentPoseIndex + 1) % poseData.length;
      applyPose(nextPoseIndex);
      setCurrentPoseIndex(nextPoseIndex);
    }
  }

  if (!showPet) {
    return <></>;
  }

  return (
    <canvas
      id="live2d"
      width="900"
      height="900"
      onClick={handleClick}
      className="cursor-grab"
      onMouseDown={(e) => e.target.classList.add('cursor-grabbing')}
      onMouseUp={(e) => e.target.classList.remove('cursor-grabbing')}
      style={{
        width: '300px', // 设置Canvas的CSS宽度
        height: '300px' // 设置Canvas的CSS高度
      }}
    />
  );
}
