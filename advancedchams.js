/////////////////////////////////////////////////////////////////
///////////////// INITIALIZATION STUFF /////////////////////////
//////////////////////////////////////////////////////////////

_materials = require('materials.js');
Material.Create("Better Custom Material");
path = ["Visuals","Better materials","Better materials"]
var basemat = 'vgui/white'
var overlay = 'models/effects/crystal_cube_vertigo_hdr'
var names = []
var material_paths = []
adjust_mats();
init();

/////////////////////////////////////////////////////////////
//////////////////// RAINBOW FUNC //////////////////////////
///////////////////////////////////////////////////////////

function HSVtoRGB(h,s,v)
{
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),        
        Math.round(g * 255),          
        Math.round(b * 255),
        255
    ]
}

/////////////////////////////////////////////////////////////
/////////////////   INIT FUNCS /////////////////////////////
////////////////////////////////////////////////////////////

function adjust_mats()
{
    var materials = _materials['materials']
    for (var i = 0; i < materials.length ; i++){
        names.push(materials[i][0])
        material_paths.push(materials[i][1])
    }
}
function init()
{
    UI.AddSubTab(["Visuals","SUBTAB_MGR"], "Better materials")
    UI.AddDropdown(path,'Base Material', names,1)
    UI.AddCheckbox(path,'Wireframe')
    UI.AddCheckbox(path,'Enable Overlay')
    UI.AddDropdown(path,'Overlay Type', ['Glow','Metallic'],0)
    UI.AddColorPicker(path,"Overlay")
    UI.AddSliderInt(path,"Vibrancy", 0,109);
    UI.AddSliderInt(path,'Saturation',0,100)
    UI.AddCheckbox(path,'Rainbow')
    UI.AddSliderFloat(path,'Rainbow Speed',0,10)
    UI.AddCheckbox(path,'Additive')
    UI.AddCheckbox(path,'Enable Animation')
    UI.AddSliderInt(path,'Speed',0,40)
    UI.AddSliderFloat(path,'Vertical Speed Mult.',0,4)
    UI.AddSliderFloat(path,'Horizontal Speed Mult.',0,4)
    UI.AddSliderFloat(path,'Horizontal Compression',0.1,4)
    UI.AddSliderFloat(path,'Vertical Compression',0.1,4)
}
function visibility()
{
    UI.SetEnabled(path.concat('Rainbow Speed'),UI.GetValue(path.concat('Rainbow'))  && UI.GetValue(path.concat('Enable Overlay'))  ? 1 : 0)
    UI.SetEnabled(path.concat('Overlay Type'),UI.GetValue(path.concat('Enable Overlay')) ? 1 : 0)
    UI.SetEnabled(path.concat('Rainbow'),UI.GetValue(path.concat('Enable Overlay')) ? 1 : 0)
    UI.SetEnabled(path.concat('Overlay'),UI.GetValue(path.concat('Enable Overlay')) ? 1 : 0)
    UI.SetEnabled(path.concat('Vibrancy'),UI.GetValue(path.concat('Enable Overlay')) ? 1 : 0)
    UI.SetEnabled(path.concat('Saturation'),UI.GetValue(path.concat('Enable Overlay')) ? 1 : 0)
    UI.SetEnabled(path.concat("Speed"), UI.GetValue(path.concat("Enable Animation")) ? 1 : 0)
    UI.SetEnabled(path.concat("Vertical Speed Mult."), UI.GetValue(path.concat("Enable Animation")) ? 1 : 0)
    UI.SetEnabled(path.concat("Horizontal Speed Mult."), UI.GetValue(path.concat("Enable Animation")) ? 1 : 0)
    UI.SetEnabled(path.concat("Horizontal Compression"), UI.GetValue(path.concat("Enable Animation")) ? 1 : 0)
    UI.SetEnabled(path.concat("Vertical Compression"), UI.GetValue(path.concat("Enable Animation")) ? 1 : 0)
}

/////////////////////////////////////////////////////////////
////////////////////// MAIN FUNCTION ///////////////////////
///////////////////////////////////////////////////////////

function updateMaterials()
{  
    var choosemat = UI.GetValue(path.concat('Base Material'))
    var overlay_type = UI.GetValue(path.concat('Overlay Type'))
    var first = UI.GetValue(path.concat('Vertical Speed Mult.'))
    var second = UI.GetValue(path.concat('Horizontal Speed Mult.'))
    var third = UI.GetValue(path.concat('Horizontal Compression'))
    var fourth = UI.GetValue(path.concat('Vertical Compression'))
    var uicol = UI.GetColor(path.concat('Overlay'))
    var aaa = UI.GetValue(path.concat("Vibrancy")) / 10;
    var speed = UI.GetValue(path.concat('Rainbow Speed'))/10
    var rainbow = UI.GetValue(path.concat('Rainbow'))
    var colors = HSVtoRGB(Global.Realtime()*speed , 1, 1);
    var additive = UI.GetValue(path.concat('Additive'))
    var saturation = UI.GetValue(path.concat('Saturation'))/100
    var speed = UI.GetValue(path.concat('Speed'))
    var wireframe = UI.GetValue(path.concat('Wireframe'));
    basemat = material_paths[choosemat]
    switch(overlay_type)
    {
        case 0:
            overlay = 'models/effects/cube_white';
        break;
        case 1 :
            overlay = 'models/effects/crystal_cube_vertigo_hdr';
        break;
        default:
            overlay = 'models/effects/cube_white';
        break;
    }
    if (rainbow)
    {
        uicol = colors
    }
    curtime = Globals.Realtime() * speed % 10000
    mat_index = Material.Get("Better Custom Material");
    if (mat_index > 0)
    {
        Material.SetKeyValue(mat_index, "$baseTexture", basemat);
        if (UI.GetValue(path.concat('Enable Overlay'))==1)
        {
            Material.SetKeyValue(mat_index, "$envmap", overlay);
            Material.SetKeyValue(mat_index, "$envmapfresnel", "1")
            Material.SetKeyValue(mat_index, "$envmapfresnelminmaxexp", "[0 " + (11 - aaa) + " " + ((11 - aaa) * 2) + "]")
            Material.SetKeyValue(mat_index, "$envmaptint", "[" + uicol[0] / 255 + " " + uicol[1] / 255 + " " + uicol[2] / 255 + "]")
            Material.SetKeyValue(mat_index, "$alpha", uicol[3] / 255 + "")
        }
        else
        {
            Material.SetKeyValue(mat_index, "$envmapfresnelminmaxexp", "[0]")
        }
        if (UI.GetValue(path.concat("Enable Animation")))
        {
            Material.SetKeyValue(mat_index, "$baseTextureTransform","center "+first +" "+second +" scale "+third+" "+ fourth + " rotate" + curtime + "  translate 0 0 " )
        }
        else
        {    
            Material.SetKeyValue(mat_index, "$baseTextureTransform","center .1 .5 scale 1.5 1.5 rotate 1 translate 0 0" )
        }
        Material.SetKeyValue(mat_index, "$reflectivity", "[1 1 1]");
        Material.SetKeyValue(mat_index, "$wireframe", wireframe ? "1" : "0")
        Material.SetKeyValue(mat_index, "$envmapsaturation", saturation.toString( ));
        Material.SetKeyValue(mat_index, "$additive",additive ?  '1' : '0');
        Material.Refresh(mat_index);
    }
}
function onUnload() {
    Material.Destroy("Better Custom Material")
}

/////////////////////////////////////////////////////////////
////////////////////////// CALLBACKS ///////////////////////
///////////////////////////////////////////////////////////

Cheat.RegisterCallback("Material", "updateMaterials")
Cheat.RegisterCallback("Draw", "visibility")
Cheat.RegisterCallback("Unload", "onUnload");