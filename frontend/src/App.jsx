import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Plus, Download, Wand2, Trash2, Eye, EyeOff } from 'lucide-react'
import './App.css'

function App() {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  })

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false)
  const printRef = useRef()

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        location: '',
        bullets: ['']
      }]
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        school: '',
        degree: '',
        graduationDate: '',
        gpa: '',
        location: ''
      }]
    }))
  }

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        bullets: ['']
      }]
    }))
  }

  const addSkill = (skill) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }))
    }
  }

  const removeSkill = (skillToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const updateProject = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    }))
  }

  const addBulletPoint = (type, id) => {
    if (type === 'experience') {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map(exp => 
          exp.id === id ? { ...exp, bullets: [...exp.bullets, ''] } : exp
        )
      }))
    } else if (type === 'project') {
      setResumeData(prev => ({
        ...prev,
        projects: prev.projects.map(proj => 
          proj.id === id ? { ...proj, bullets: [...proj.bullets, ''] } : proj
        )
      }))
    }
  }

  const updateBulletPoint = (type, id, bulletIndex, value) => {
    if (type === 'experience') {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map(exp => 
          exp.id === id ? {
            ...exp,
            bullets: exp.bullets.map((bullet, index) => 
              index === bulletIndex ? value : bullet
            )
          } : exp
        )
      }))
    } else if (type === 'project') {
      setResumeData(prev => ({
        ...prev,
        projects: prev.projects.map(proj => 
          proj.id === id ? {
            ...proj,
            bullets: proj.bullets.map((bullet, index) => 
              index === bulletIndex ? value : bullet
            )
          } : proj
        )
      }))
    }
  }

  const removeBulletPoint = (type, id, bulletIndex) => {
    if (type === 'experience') {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map(exp => 
          exp.id === id ? {
            ...exp,
            bullets: exp.bullets.filter((_, index) => index !== bulletIndex)
          } : exp
        )
      }))
    } else if (type === 'project') {
      setResumeData(prev => ({
        ...prev,
        projects: prev.projects.map(proj => 
          proj.id === id ? {
            ...proj,
            bullets: proj.bullets.filter((_, index) => index !== bulletIndex)
          } : proj
        )
      }))
    }
  }

  const generateBulletPoints = async (type, id, context) => {
    setIsGeneratingBullets(true)
    try {
      const response = await fetch('/api/generate-bullets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ context, type })
      })
      
      if (response.ok) {
        const data = await response.json()
        const bullets = data.bullets || []
        
        if (type === 'experience') {
          setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => 
              exp.id === id ? { ...exp, bullets } : exp
            )
          }))
        } else if (type === 'project') {
          setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(proj => 
              proj.id === id ? { ...proj, bullets } : proj
            )
          }))
        }
      }
    } catch (error) {
      console.error('Error generating bullet points:', error)
    } finally {
      setIsGeneratingBullets(false)
    }
  }

  const removeItem = (type, id) => {
    setResumeData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== id)
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  const SkillInput = () => {
    const [skillInput, setSkillInput] = useState('')
    
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        addSkill(skillInput)
        setSkillInput('')
      }
    }

    return (
      <div className="flex gap-2">
        <Input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a skill and press Enter"
          className="flex-1"
        />
        <Button 
          onClick={() => {
            addSkill(skillInput)
            setSkillInput('')
          }}
          size="sm"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  if (isPreviewMode) {
    return (
      <div className="min-h-screen bg-sky-200 p-4">
        <div className="max-w-3xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6 print:hidden">
            <h1 className="text-2xl font-bold">Resume Preview</h1>
            <div className="flex gap-2">
              <Button onClick={() => setIsPreviewMode(false)} variant="outline">
                <EyeOff className="w-4 h-4 mr-2" />
                Edit Mode
              </Button>
              <Button onClick={handlePrint}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
          
          <div ref={printRef} className="bg-white p-10 shadow-lg rounded-md print:shadow-none print:p-0 print:rounded-none">
            {/* Resume Preview Content */}
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="text-3xl font-bold text-black">{resumeData.personalInfo.name || 'Your Name'}</h1>
                <div className="flex flex-wrap justify-center gap-5 mt-2 text-sm text-black">
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                  {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                  {resumeData.personalInfo.github && <span>{resumeData.personalInfo.github}</span>}
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div>
                  <div className="flex items-center justify-center my-4">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="mx-4 text-lg font-semibold text-black tracking-wide">Professional Summary</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                  </div>
                  <p className="text-black">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div>
                  <div>
                    <div className="flex items-center justify-center my-4">
                      <div className="flex-grow border-t border-gray-400"></div>
                      <span className="mx-4 text-lg font-semibold text-black tracking-wide">Experience</span>
                      <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                  </div>
                  {resumeData.experience.map(exp => (
                    <div key={exp.id} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold text-black">{exp.position || 'Position'}</h3>
                          <p className="text-black">{exp.company || 'Company'}</p>
                        </div>
                        <div className="text-right text-sm text-black">
                          <p>{exp.startDate} - {exp.endDate}</p>
                          {exp.location && <p>{exp.location}</p>}
                        </div>
                      </div>
                      {exp.bullets.filter(bullet => bullet.trim()).length > 0 && (
                        <ul className="list-disc list-inside text-black">
                          {exp.bullets.filter(bullet => bullet.trim()).map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <div>
                  <div className="flex items-center justify-center my-4">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="mx-4 text-lg font-semibold text-black tracking-wide">Projects</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                  </div>
                  {resumeData.projects.map(proj => (
                    <div key={proj.id} className="mb-4">
                      <h3 className="font-semibold text-black">{proj.name || 'Project Name'}</h3>
                      {proj.technologies && (
                        <p className="text-sm text-black mb-1">Technologies: {proj.technologies}</p>
                      )}
                      {proj.description && (
                        <p className="text-black mb-2">{proj.description}</p>
                      )}
                      {proj.bullets.filter(bullet => bullet.trim()).length > 0 && (
                        <ul className="list-disc list-inside ml-4 text-black">
                          {proj.bullets.filter(bullet => bullet.trim()).map((bullet, index) => (
                            <li key={index}>{bullet}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div>
                  <div className="flex items-center justify-center my-4">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="mx-4 text-lg font-semibold text-black tracking-wide">Education</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                  </div>
                  {resumeData.education.map(edu => (
                    <div key={edu.id} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-black">{edu.degree || 'Degree'}</h3>
                          <p className="text-black">{edu.school || 'School'}</p>
                          {edu.gpa && <p className="text-sm text-black">GPA: {edu.gpa}</p>}
                        </div>
                        <div className="text-right text-sm text-black">
                          <p>{edu.graduationDate}</p>
                          {edu.location && <p>{edu.location}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div>
                  <div className="flex items-center justify-center my-4">
                    <div className="flex-grow border-t border-gray-400"></div>
                    <span className="mx-4 text-lg font-semibold text-black tracking-wide">Skills</span>
                    <div className="flex-grow border-t border-gray-400"></div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resumeData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sky-200 p-4">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">AI Resume Builder</h1>
          <Button onClick={() => setIsPreviewMode(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => updatePersonalInfo('name', e.target.value)}
                      placeholder="Nikita Sinha"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="nikita@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      placeholder="your contact here"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="your location here"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/nikita-sinha"
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="github.com/nixeeta"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={resumeData.summary}
                  onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Write a brief professional summary..."
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SkillInput />
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Education</CardTitle>
                <Button onClick={addEducation} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Education {index + 1}</h4>
                      <Button
                        onClick={() => removeItem('education', edu.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                        placeholder="School Name"
                      />
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Degree"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                        placeholder="Graduation Date"
                      />
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        placeholder="GPA (optional)"
                      />
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                        placeholder="Location"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Experience, Projects, Education */}
          <div className="space-y-6">
            {/* Experience */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Experience</CardTitle>
                <Button onClick={addExperience} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        onClick={() => removeItem('experience', exp.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="Company Name"
                      />
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                        placeholder="Job Title"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        placeholder="Start Date"
                      />
                      <Input
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="End Date"
                      />
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="Location"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Bullet Points</Label>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => generateBulletPoints('experience', exp.id, {
                              company: exp.company,
                              position: exp.position,
                              context: 'Generate professional bullet points for this work experience'
                            })}
                            size="sm"
                            variant="outline"
                            disabled={isGeneratingBullets}
                          >
                            <Wand2 className="w-4 h-4 mr-2" />
                            {isGeneratingBullets ? 'Generating...' : 'AI Generate'}
                          </Button>
                          <Button onClick={() => addBulletPoint('experience', exp.id)} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex gap-2">
                          <Textarea
                            value={bullet}
                            onChange={(e) => updateBulletPoint('experience', exp.id, bulletIndex, e.target.value)}
                            placeholder="Describe your achievement or responsibility..."
                            rows={2}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => removeBulletPoint('experience', exp.id, bulletIndex)}
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <Button onClick={addProject} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {resumeData.projects.map((proj, index) => (
                  <div key={proj.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Project {index + 1}</h4>
                      <Button
                        onClick={() => removeItem('projects', proj.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      value={proj.name}
                      onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                      placeholder="Project Name"
                    />
                    <Input
                      value={proj.technologies}
                      onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                      placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                    />
                    <Textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      placeholder="Brief project description..."
                      rows={2}
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Bullet Points</Label>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => generateBulletPoints('project', proj.id, {
                              name: proj.name,
                              technologies: proj.technologies,
                              description: proj.description,
                              context: 'Generate professional bullet points for this project'
                            })}
                            size="sm"
                            variant="outline"
                            disabled={isGeneratingBullets}
                          >
                            <Wand2 className="w-4 h-4 mr-2" />
                            {isGeneratingBullets ? 'Generating...' : 'AI Generate'}
                          </Button>
                          <Button onClick={() => addBulletPoint('project', proj.id)} size="sm">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {proj.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex gap-2">
                          <Textarea
                            value={bullet}
                            onChange={(e) => updateBulletPoint('project', proj.id, bulletIndex, e.target.value)}
                            placeholder="Describe what you accomplished in this project..."
                            rows={2}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => removeBulletPoint('project', proj.id, bulletIndex)}
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

