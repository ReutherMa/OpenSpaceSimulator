
    uniform vec4 sunPosition;

        //test for bumpmap
        vec3 tangent_base = vec3 (0, 1, 0);
        varying vec3 view;
        varying vec3 tbase;
        
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 sunDirection;
        varying vec4 mvPosition;
        
#include <common>
#include <logdepthbuf_pars_vertex>

        void main() {
                vUv = uv;
                mvPosition = modelViewMatrix * vec4(position, 1.0);
                sunDirection = sunPosition.xyz - mvPosition.xyz;
                vNormal = normalMatrix * normal;
                gl_Position = projectionMatrix * mvPosition;
                
                //test for bumpmap
                view = normalize (- vec3( modelViewMatrix * mvPosition));
                tbase = mat3(modelViewMatrix) * tangent_base;
                
                
                
#ifdef USE_LOGDEPTHBUF
               gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;
  #ifdef USE_LOGDEPTHBUF_EXT
               vFragDepth = 1.0 + gl_Position.w;
  #else
               gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;
  #endif
#endif
        }
