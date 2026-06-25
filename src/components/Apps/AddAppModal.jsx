import { useEffect, useState } from "react"
import { Button, Input, Modal } from "../ui"
import { createApp, updateApp, uploadFile } from "../../services/api"

export function AddAppModal({ open, onClose, onSuccess, toast, app = null }) {
    const [form, setForm] = useState({
        name: '',
        code: '',
        api_url: '',
        web_url: '',
        icon: '',
        has_mobile_app: false,
        sso_secret: '',
        is_active: true,
        description: '',
    })
    const [uploading, setUploading] = useState(false);
    const [iconFile, setIconFile] = useState(null)
    const [preview, setPreview] = useState('')

    useEffect(() => {
        if (app) {
            setForm({
                name: app.name || '',
                code: app.code || '',
                api_url: app.api_url || '',
                web_url: app.web_url || '',
                icon: app.app_icon || app.icon || '',
                has_mobile_app: app.has_mobile_app || false,
                sso_secret: app.sso_secret || '',
                is_active: app.is_active ?? true,
                description: app.description || '',
            })
        }
    }, [app])

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const set = k => e => {
        const value =
            e?.target?.type === 'checkbox'
                ? e.target.checked
                : e.target.value

        setForm(f => ({
            ...f,
            [k]: value
        }))
    }

    const validate = () => {
        const e = {}

        if (!form.name) e.name = 'Required'
        if (!form.code) e.code = 'Required'
        if (!form.api_url) e.api_url = 'Required'

        setErrors(e)

        return Object.keys(e).length === 0
    }

    const submit = async (e) => {
        e.preventDefault()

        if (!validate())
            return

        setLoading(true)

        try {
            let iconUrl = form.icon
            let appData;

            if (app) {
                await updateApp(app.id, form)
                toast({
                    title: 'App updated!',
                    description: `${form.name} updated successfully.`,
                })
            } else {
                appData = await createApp(form)
                toast({
                    title: 'App created!',
                    description: `${form.name} added successfully.`,
                })
            }

            // icon upload
            if (iconFile) {
                const fd = new FormData()
                fd.append('file', iconFile)
                fd.append('folder', form.code + '/app-icons')
                fd.append('app_id', app?.id || appData.data.app.id);
                const uploadRes = await uploadFile(fd)
                iconUrl = uploadRes.data.url
            }

            setForm({
                name: '',
                code: '',
                api_url: '',
                web_url: '',
                icon: '',
                has_mobile_app: false,
                sso_secret: '',
                is_active: true,
                description: '',
            })

            onSuccess()

        } catch (err) {
            console.log('errr create app', err);
            toast({
                title: 'Failed',
                description:
                    err.response?.data?.message ||
                    'Something went wrong',
                variant: 'destructive',
            })

        } finally {
            setLoading(false)
        }
    }

    const handleIconUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIconFile(file)
        setPreview(URL.createObjectURL(file))
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={app ? "✏️ Edit App" : "🚀 Add New App"}
            size="xl"
        >
            <form
                onSubmit={submit}
                className="space-y-4"
            >

                {/* BASIC DETAILS */}

                <div className="border-b border-border pb-4">
                    <h3 className="font-semibold text-base mb-3">
                        Basic Details
                    </h3>

                    <Input
                        label="App Name"
                        placeholder="CRM"
                        value={form.name}
                        onChange={set('name')}
                        error={errors.name}
                    />

                    <div className="grid gap-3 my-3">

                        <Input
                            label="App Code"
                            placeholder="crm"
                            value={form.code}
                            onChange={set('code')}
                            error={errors.code}
                        />

                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-semibold mb-2">
                            App Icon
                        </label>

                        <div className="    border-2    border-dashed    border-slate-300    rounded-2xl    p-6    text-center    hover:border-blue-500    transition-all    bg-slate-50">

                            {preview || form.icon ? (
                                <div className="space-y-3">
                                    <img
                                        src={preview || form.icon}
                                        alt="icon"
                                        className=" w-24 h-24 mx-auto rounded-2xl object-cover shadow" />

                                    <label className="  inline-flex  items-center  px-4  py-2  rounded-xl  bg-blue-500  text-white  cursor-pointer  hover:bg-blue-600">
                                        Change Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleIconUpload}
                                            hidden
                                        />
                                    </label>

                                </div>
                            ) : (
                                <label className="cursor-pointer block">

                                    <div className="text-5xl mb-3">
                                        📸
                                    </div>

                                    <p className="font-semibold">
                                        Upload App Icon
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        PNG, JPG, WEBP up to 2MB
                                    </p>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleIconUpload}
                                        hidden
                                    />
                                </label>
                            )}
                            {uploading && (
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <div
                                        className="
                h-8
                w-8
                rounded-full
                border-4
                border-slate-200
                border-t-blue-500
                animate-spin
            "
                                    />
                                    <p className="text-sm text-blue-600 font-medium">
                                        Uploading image...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* URLS */}

                <div className="border-b border-border pb-4">
                    <h3 className="font-semibold text-base mb-3">
                        App URLs
                    </h3>

                    <Input
                        label="API URL"
                        placeholder="https://api.crm.com"
                        value={form.api_url}
                        onChange={set('api_url')}
                        error={errors.api_url}
                    />

                    <div className="mt-3">

                        <Input
                            label="Website URL"
                            placeholder="https://crm.com"
                            value={form.web_url}
                            onChange={set('web_url')}
                        />

                    </div>

                </div>
 

                {/* SETTINGS */}

                <div className="border-b border-border pb-4">
                    <h3 className="font-semibold text-base mb-3">
                        Settings
                    </h3>

                    <div className="space-y-3">

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.has_mobile_app}
                                onChange={set('has_mobile_app')}
                            />

                            <span>
                                Has Mobile App
                            </span>
                        </label>

                        <label className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={set('is_active')}
                            />

                            <span>
                                Active
                            </span>
                        </label>

                    </div>
                </div>

                {/* DESCRIPTION */}

                <div>
                    <label
                        className="
                            block
                            text-xs
                            font-bold
                            text-slate-500
                            uppercase
                            tracking-[0.15em]
                            mb-2
                        "
                    >
                        Description
                    </label>

                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={set('description')}
                        className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            bg-slate-50
                            border
                            border-slate-200
                            text-sm
                            focus:outline-none
                            focus:ring-4
                            focus:ring-blue-100
                            focus:border-blue-500
                        "
                    />
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-border">

                    <Button
                        variant="ghost"
                        type="button"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        loading={loading}
                    >
                        {app ? "Update App" : "Create App"}
                    </Button>

                </div>

            </form>
        </Modal>
    )
}